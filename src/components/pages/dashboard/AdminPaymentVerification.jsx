import { useState, useEffect } from "react";
import { db } from "../../firebaseConfig";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  getDoc, // Add this import
} from "firebase/firestore";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  CircularProgress,
  Chip,
  Divider,
} from "@mui/material";
import { Check as CheckIcon, Close as CloseIcon } from "@mui/icons-material";
import { toast } from "react-toastify";
import Loading from "../../Loadder";

const AdminPaymentVerification = () => {
  const [pendingPayments, setPendingPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPendingPayments();
  }, []);

  const fetchPendingPayments = async () => {
    try {
      setLoading(true);
      const paymentsRef = collection(db, "payments");
      const q = query(
        paymentsRef,
        where("status", "==", "pending_verification")
      );
      const snapshot = await getDocs(q);

      const payments = await Promise.all(
        snapshot.docs.map(async (docSnap) => {
          const payment = docSnap.data();
          // Get additional details
          const userSnap = await getDoc(doc(db, "users", payment.userId));
          const loanSnap = await getDoc(doc(db, "loans", payment.loanId));
          const installmentSnap = await getDoc(
            doc(
              db,
              "emi",
              payment.loanId,
              "installments",
              payment.installmentId
            )
          );

          return {
            id: docSnap.id,
            ...payment,
            userName: userSnap.exists()
              ? userSnap.data().displayName || payment.userEmail
              : payment.userEmail,
            loanType: loanSnap.exists() ? loanSnap.data().loanType : "Unknown",
            installmentNo: installmentSnap.exists()
              ? installmentSnap.data().installmentNo ||
                installmentSnap.data().installmentNumber ||
                "N/A"
              : "N/A",
            paymentDate: payment.paymentDate?.toDate?.() || payment.paymentDate,
          };
        })
      );

      setPendingPayments(payments);
    } catch (error) {
      setError("Failed to load pending payments");
      console.error("Error fetching payments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPayment = async (paymentId, isApproved) => {
    try {
      // Update payment status
      const paymentRef = doc(db, "payments", paymentId);
      const payment = pendingPayments.find((p) => p.id === paymentId);

      await updateDoc(paymentRef, {
        status: isApproved ? "verified" : "rejected",
        processedAt: new Date(),
      });

      // If approved, update installment status
      if (isApproved) {
        const installmentRef = doc(
          db,
          "emi",
          payment.loanId,
          "installments",
          payment.installmentId
        );
        await updateDoc(installmentRef, {
          status: "paid",
          verifiedAt: new Date(),
        });
      }

      toast.success(`Payment ${isApproved ? "approved" : "rejected"}`);
      setPendingPayments(pendingPayments.filter((p) => p.id !== paymentId));
    } catch (error) {
      toast.error(`Failed to ${isApproved ? "approve" : "reject"} payment`);
      console.error("Error verifying payment:", error);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" py={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box py={2}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h6">Pending Payment Verifications</Typography>
        <Typography variant="body2" color="text.secondary">
          {pendingPayments.length} pending payments
        </Typography>
      </Box>

      {pendingPayments.length === 0 ? (
        <Typography
          variant="body1"
          color="text.secondary"
          textAlign="center"
          py={4}
        >
          No pending payments to verify
        </Typography>
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>Loan Details</TableCell>
                <TableCell>Payment Info</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pendingPayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>
                    <Typography fontWeight="medium">
                      {payment.userName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {payment.userEmail}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{payment.loanType} Loan</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Installment #{payment.installmentNo}
                    </Typography>
                    <Typography variant="body2">
                      ₹{payment.amount.toFixed(2)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>
                      UTR:{" "}
                      <span style={{ fontFamily: "monospace" }}>
                        {payment.utrNumber}
                      </span>
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Paid on:{" "}
                      {payment.paymentDate?.toLocaleString?.() || "N/A"}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" gap={1}>
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        startIcon={<CheckIcon />}
                        onClick={() => handleVerifyPayment(payment.id, true)}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        startIcon={<CloseIcon />}
                        onClick={() => handleVerifyPayment(payment.id, false)}
                      >
                        Reject
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>
  );
};

export default AdminPaymentVerification;
