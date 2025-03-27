import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getFirestore,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  setDoc,
  collection,
  addDoc,
  Timestamp,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import {
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  Box,
  TextField,
  MenuItem,
  Alert,
} from "@mui/material";
import { toast } from "react-toastify";

const LoanApproval = () => {
  const { loanId } = useParams();
  const db = getFirestore();
  const auth = getAuth();
  const navigate = useNavigate();

  const [loan, setLoan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  // EMI State
  const [emiCreated, setEmiCreated] = useState(false);
  const [interestRate, setInterestRate] = useState("");
  const [duration, setDuration] = useState("");
  const [emiAmount, setEmiAmount] = useState("");

  const checkAdminRole = async () => {
    const user = auth.currentUser;
    if (!user) {
      setError("No user logged in.");
      navigate("/unauthorized");
      return;
    }

    try {
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists() && userSnap.data().role === "admin") {
        setIsAdmin(true);
      } else {
        setError("Unauthorized access.");
        navigate("/unauthorized");
      }
    } catch (error) {
      console.error("Error checking admin role:", error);
      setError("Failed to verify admin role.");
      navigate("/unauthorized");
    }
  };

  useEffect(() => {
    const fetchLoanDetails = async () => {
      setLoading(true);
      await checkAdminRole();

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
        setError("Error fetching loan details.");
      } finally {
        setLoading(false);
      }
    };

    fetchLoanDetails();
  }, [loanId, db, auth, navigate]);

  const handleCreateEMI = async () => {
    if (!interestRate || !duration) {
      setError("Please select both interest rate and duration.");
      return;
    }
  
    const principal = parseFloat(loan.loanAmount);
    const monthlyRate = parseFloat(interestRate) / 100 / 12;
    const months = parseInt(duration);
  
    // EMI calculation formula
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
                (Math.pow(1 + monthlyRate, months) - 1);
    const calculatedEmi = emi.toFixed(2);
  
    setEmiAmount(calculatedEmi);
    const approvedDate = new Date();
  
    try {
      // 1. Save EMI details in 'emi' collection
      const emiRef = doc(db, "emi", loanId);
      
      // Create installments array first
      const installments = [];
      let currentDate = new Date(approvedDate);
      
      for (let i = 1; i <= months; i++) {
        currentDate.setMonth(currentDate.getMonth() + 1);
        const dueDate = new Date(currentDate);
        
        installments.push({
          installmentNo: i,
          amount: calculatedEmi,
          originalAmount: calculatedEmi, // Store original amount
          dueDate: dueDate,
          status: "pending",
          lateFee: "0.00", // Initialize late fee
          totalPayable: calculatedEmi, // Will update if late
          paidAt: null,
          paymentId: null
        });
      }
  
      // Save EMI document with installments array
      await setDoc(emiRef, {
        loanId: loan.id,
        userId: loan.userId,
        loanType: loan.loanType,
        principal: principal.toString(),
        interestRate: interestRate.toString(),
        duration: duration.toString(),
        emiAmount: calculatedEmi,
        approvedAt: approvedDate,
        status: "active",
        installments: installments, // Store installments array in EMI doc
        totalPaid: "0.00",
        remainingAmount: (emi * months).toFixed(2)
      });
  
      // 2. Also save installments as subcollection for easier individual access
      const installmentsRef = collection(db, `emi/${loanId}/installments`);
      
      for (const installment of installments) {
        await addDoc(installmentsRef, {
          ...installment,
          dueDate: installment.dueDate, // Firestore will convert Date object
        });
      }
  
      setEmiCreated(true);
      toast.success("EMI schedule created successfully!");
      
    } catch (error) {
      console.error("Error creating EMI and installments:", error);
      setError("Failed to create EMI. Please try again.");
    }
  };

  const handleApproveLoan = async () => {
    if (!emiCreated) {
      setError("Please create EMI before approving the loan.");
      return;
    }

    try {
      const loanRef = doc(db, "applications", loanId);
      const approvedDate = new Date();
      const approvedLoanRef = doc(db, "loans", loanId);

      await setDoc(approvedLoanRef, {
        ...loan,
        status: "Approved",
        approvedDate: Timestamp.fromDate(approvedDate),
        emi: {
          interestRate: interestRate.toString(),
          duration: duration.toString(),
          emiAmount: emiAmount,
        },
      });

      await deleteDoc(loanRef);
      alert("Congratulations! Loan approved successfully.");
      navigate("/admin-dashboard");
    } catch (error) {
      console.error("Error approving loan:", error);
      setError("Error approving loan.");
    }
  };

  const handleRejectLoan = async () => {
    try {
      const loanRef = doc(db, "applications", loanId);
      await updateDoc(loanRef, { status: "Rejected" });
      navigate("/admin-dashboard");
    } catch (error) {
      setError("Error rejecting loan.");
    }
  };

  return (
    <Box sx={{ padding: 4 }}>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Alert severity="error">{error}</Alert>
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

            {!emiCreated ? (
              <Box sx={{ marginTop: 4 }}>
                <Typography variant="h5">Create EMI</Typography>
                <TextField
                  select
                  label="Interest Rate (%)"
                  value={interestRate}
                  onChange={(e) => setInterestRate(e.target.value)}
                  fullWidth
                  margin="normal"
                >
                  <MenuItem value="8">8%</MenuItem>
                  <MenuItem value="10">10%</MenuItem>
                  <MenuItem value="12">12%</MenuItem>
                  <MenuItem value="15">15%</MenuItem>
                </TextField>

                <TextField
                  select
                  label="Duration (Months)"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  fullWidth
                  margin="normal"
                >
                  <MenuItem value="3">3 Months</MenuItem>
                  <MenuItem value="6">6 Months</MenuItem>
                  <MenuItem value="12">12 Months</MenuItem>
                  <MenuItem value="24">24 Months</MenuItem>
                </TextField>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mt: 2,
                  }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleCreateEMI}
                  >
                    Create EMI
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={handleRejectLoan}
                  >
                    Reject Loan
                  </Button>
                </Box>
              </Box>
            ) : (
              <Box sx={{ marginTop: 4 }}>
                <Typography variant="h5" color="green">
                  EMI Created Successfully
                </Typography>
                <Typography>EMI Amount: ₹{emiAmount}</Typography>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mt: 2,
                  }}
                >
                  <Button
                    variant="contained"
                    color="success"
                    onClick={handleApproveLoan}
                  >
                    Approve Loan
                  </Button>
                </Box>
              </Box>
            )}
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default LoanApproval;
