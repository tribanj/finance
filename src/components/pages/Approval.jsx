import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getFirestore, doc, getDoc, updateDoc, deleteDoc, setDoc, Timestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { Card, CardContent, Typography, Button, CircularProgress, Box, TextField, MenuItem, Alert } from "@mui/material";

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
  const [emiAmount, setEmiAmount] = useState(0);

  // 🔥 Fetch User Role from Firestore
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
      await checkAdminRole(); // Check admin status

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

  // 💡 Create EMI and Store in Firestore
  const handleCreateEMI = async () => {
    if (!interestRate || !duration) {
      setError("Please select both interest rate and duration.");
      return;
    }
  
    const principal = loan.loanAmount.toString(); // Ensure principal is saved as string
    const rate = (parseFloat(interestRate) / 100 / 12).toString();
    const n = parseInt(duration).toString();
  
    const emi = (
      (parseFloat(loan.loanAmount) * (parseFloat(interestRate) / 100 / 12) * Math.pow(1 + parseFloat(rate), parseInt(n))) /
      (Math.pow(1 + parseFloat(rate), parseInt(n)) - 1)
    ).toFixed(2);
  
    const emiAmount = emi.toString();
    const approvedDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
  
    try {
      const emiRef = doc(db, "emi", loanId);
      await setDoc(emiRef, {
        loanId: loan.id,
        userId: loan.userId,
        loanType: loan.loanType,
        principal,                  // Save as string
        interestRate: interestRate.toString(),   // Save as string
        duration: duration.toString(),           // Save as string
        emiAmount,                  // Save as string
        approvedAt: approvedDate,   // Add approved date
        status: "EMI Created",
      });
  
      setEmiCreated(true);
    } catch (error) {
      setError("Failed to create EMI.");
    }
  };
  

  // ✅ Approve Loan with Approved Date
  const handleApproveLoan = async () => {
    if (!emiCreated) {
      setError("Please create EMI before approving the loan.");
      return;
    }

    try {
      const loanRef = doc(db, "applications", loanId);
      
      // Get the current date
      const approvedDate = new Date();
      
      // Move the loan to 'loans' collection with EMI details and approved date
      const approvedLoanRef = doc(db, "loans", loanId);
      await setDoc(approvedLoanRef, {
        ...loan,
        status: "Approved",
        approvedDate: Timestamp.fromDate(approvedDate),  // Save the current date
        emi: {
          interestRate,
          duration,
          emiAmount,
        },
      });

      await deleteDoc(loanRef); // Remove from applications
      navigate("/admin-dashboard");
    } catch (error) {
      setError("Error approving loan.");
    }
  };

  // 🚫 Reject Loan
  const handleRejectLoan = async () => {
    try {
      const loanRef = doc(db, "applications", loanId);
      await updateDoc(loanRef, { status: "Rejected" });

      // Navigate back to admin dashboard
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

            {/* EMI Creation Section */}
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
                  <MenuItem value="17">17%</MenuItem>
                  <MenuItem value="19">19%</MenuItem>
                  <MenuItem value="20">20%</MenuItem>
                  <MenuItem value="22">22%</MenuItem>
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
                  <MenuItem value="36">36 Months</MenuItem>
                  <MenuItem value="48">48 Months</MenuItem>
                </TextField>

                <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
                  <Button variant="contained" color="primary" onClick={handleCreateEMI}>
                    Create EMI
                  </Button>

                  <Button variant="contained" color="error" onClick={handleRejectLoan}>
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
                <Typography>Interest Rate: {interestRate}%</Typography>
                <Typography>Duration: {duration} months</Typography>

                <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
                  <Button variant="contained" color="success" onClick={handleApproveLoan}>
                    Approve Loan
                  </Button>

                  <Button variant="contained" color="error" onClick={handleRejectLoan}>
                    Reject Loan
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
