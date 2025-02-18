import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getFirestore, doc, getDoc, updateDoc, deleteDoc, setDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { Card, CardContent, Typography, Button, CircularProgress, Box } from "@mui/material";

const LoanApproval = () => {
  const { loanId } = useParams();
  const db = getFirestore();
  const auth = getAuth();
  const navigate = useNavigate();

  const [loan, setLoan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLoanDetails = async () => {
      setLoading(true);
      try {
        const loanRef = doc(db, "applications", loanId);
        const loanSnap = await getDoc(loanRef);

        if (!loanSnap.exists()) {
          setError("Loan application not found.");
          setLoading(false);
          return;
        }

        setLoan({ id: loanSnap.id, ...loanSnap.data() });
      } catch (err) {
        setError("Error fetching loan details.", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLoanDetails();
  }, [loanId, db]);

  const handleApproval = async (status) => {
    if (!loan) return;

    try {
      const user = auth.currentUser;
      if (!user) {
        setError("You must be logged in as an admin.");
        return;
      }

      // Check if user is an admin
      const token = await user.getIdTokenResult();
      if (token.claims.role !== "admin") {
        setError("Only admins can approve loans.");
        return;
      }

      const loanRef = doc(db, "applications", loanId);
      const updatedData = { status };

      if (status === "Approved") {
        // Move to 'loans' collection
        const approvedLoanRef = doc(db, "loans", loanId);
        await setDoc(approvedLoanRef, { ...loan, status: "Approved" });

        // Delete from 'applications'
        await deleteDoc(loanRef);
      } else {
        // Update status in 'applications'
        await updateDoc(loanRef, updatedData);
      }

      navigate("/admin"); // Redirect after action
    } catch (err) {
      setError("Error updating loan status.", err);
    }
  };

  return (
    <Box sx={{ padding: 4 }}>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <Card sx={{ padding: 2 }}>
          <CardContent>
            <Typography variant="h4" gutterBottom>
              Loan Approval for Application ID: {loan.id}
            </Typography>
            <Typography variant="h6">User ID: {loan.userId}</Typography>
            <Typography>Loan Type: {loan.loanType}</Typography>
            <Typography>Amount: ₹{loan.loanAmount}</Typography>
            <Typography>Status: {loan.status}</Typography>

            <Box sx={{ marginTop: 2, display: "flex", gap: 2 }}>
              <Button variant="contained" color="success">
                Approve Loan
              </Button>
              <Button variant="contained" color="error" >
                Reject Loan
              </Button>
              <Button variant="contained" color="warning" >
                Create Emi
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default LoanApproval;
