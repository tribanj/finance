import { useState, useEffect } from "react";
import { db } from "../../firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import useAdminCheck from "../../hooks/useAdminCheck";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Paper,
  Grid,
  Button,
  CircularProgress,
  Chip,
} from "@mui/material";
import {
  People as UsersIcon,
  RequestPage as LoansIcon,
  Notifications as NotificationsIcon,
  Paid as PaymentsIcon,
  CheckCircle as ApprovedIcon,
  Verified as VerifiedIcon,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import Loading from "../../Loadder";
import AdminPaymentVerification from "./AdminPaymentVerification";

const Dashboard = () => {
  const isAdmin = useAdminCheck();
  const [users, setUsers] = useState([]);
  const [pendingLoans, setPendingLoans] = useState([]);
  const [approvedLoans, setApprovedLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("users");

  useEffect(() => {
    if (isAdmin) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [isAdmin]);

  const fetchData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchUsers(),
        fetchPendingLoans(),
        fetchApprovedLoans(),
      ]);
    } catch (error) {
      setError("Failed to fetch data. Please try again later.");
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const usersSnapshot = await getDocs(collection(db, "users"));
      const usersList = usersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(usersList);
    } catch (error) {
      setError("Error fetching users.");
      console.error("Error fetching users:", error);
    }
  };

  const fetchPendingLoans = async () => {
    try {
      const loansQuery = query(
        collection(db, "applications"),
        where("status", "==", "pending")
      );
      const loansSnapshot = await getDocs(loansQuery);
      const pendingLoansList = loansSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPendingLoans(pendingLoansList);
    } catch (error) {
      setError("Error fetching pending loans.");
      console.error("Error fetching pending loans:", error);
    }
  };

  const fetchApprovedLoans = async () => {
    try {
      const loansSnapshot = await getDocs(collection(db, "loans"));
      const approvedLoansList = loansSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setApprovedLoans(approvedLoansList);
    } catch (error) {
      setError("Error fetching approved loans.");
      console.error("Error fetching approved loans:", error);
    }
  };

  const totalUsers = users.length;
  const totalPendingLoans = pendingLoans.length;
  const totalApprovedLoans = approvedLoans.length;
  const totalDisbursedAmount = approvedLoans.reduce(
    (sum, loan) => sum + (loan.amount || 0),
    0
  );

  if (!isAdmin) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        flexDirection="column"
      >
        <Loading />
        <Typography variant="h6" mt={2}>
          Access Denied! You are not an admin
        </Typography>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box display="flex" minHeight="100vh" bgcolor="#f5f5f5">
      {/* Left Sidebar */}
      <Paper
        elevation={3}
        sx={{
          width: "250px",
          minHeight: "100vh",
          bgcolor: "#1e293b",
          color: "white",
        }}
      >
        <Box p={2}>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
            Admin Dashboard
          </Typography>
          <Divider sx={{ bgcolor: "white", mb: 2 }} />
          <List>
            <ListItem
              button
              onClick={() => setActiveTab("users")}
              sx={{
                bgcolor: activeTab === "users" ? "#334155" : "transparent",
                "&:hover": { bgcolor: "#334155", cursor: "pointer" },
              }}
            >
              <ListItemIcon>
                <UsersIcon sx={{ color: "white" }} />
              </ListItemIcon>
              <ListItemText primary="Users" />
            </ListItem>
            <ListItem
              button
              onClick={() => setActiveTab("loans")}
              sx={{
                bgcolor: activeTab === "loans" ? "#334155" : "transparent",
                "&:hover": { bgcolor: "#334155", cursor: "pointer" },
              }}
            >
              <ListItemIcon>
                <LoansIcon sx={{ color: "white" }} />
              </ListItemIcon>
              <ListItemText primary="Loan Applications" />
            </ListItem>
            <ListItem
              button
              onClick={() => setActiveTab("payments")}
              sx={{
                bgcolor: activeTab === "payments" ? "#334155" : "transparent",
                "&:hover": { bgcolor: "#334155", cursor: "pointer" },
              }}
            >
              <ListItemIcon>
                <PaymentsIcon sx={{ color: "white" }} />
              </ListItemIcon>
              <ListItemText primary="Payment Verifications" />
            </ListItem>
            <ListItem
              button
              onClick={() => setActiveTab("notifications")}
              sx={{
                bgcolor:
                  activeTab === "notifications" ? "#334155" : "transparent",
                "&:hover": { bgcolor: "#334155", cursor: "pointer" },
              }}
            >
              <ListItemIcon>
                <NotificationsIcon sx={{ color: "white" }} />
              </ListItemIcon>
              <ListItemText primary="Notifications" />
            </ListItem>
            <ListItem
              button
              onClick={() => setActiveTab("approved")}
              sx={{
                bgcolor: activeTab === "approved" ? "#334155" : "transparent",
                "&:hover": { bgcolor: "#334155", cursor: "pointer" },
              }}
            >
              <ListItemIcon>
                <ApprovedIcon sx={{ color: "white" }} />
              </ListItemIcon>
              <ListItemText primary="Approved Loans" />
            </ListItem>
          </List>
        </Box>
      </Paper>

      {/* Right Content */}
      <Box flex={1} p={4}>
        <Typography variant="h4" sx={{ fontWeight: "bold", mb: 4 }}>
          Dashboard Overview
        </Typography>

        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper
              elevation={3}
              sx={{ p: 3, bgcolor: "#3b82f6", color: "white" }}
            >
              <Typography variant="h6">Total Users</Typography>
              <Typography variant="h4">{totalUsers}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper
              elevation={3}
              sx={{ p: 3, bgcolor: "#10b981", color: "white" }}
            >
              <Typography variant="h6">Disbursed Amount</Typography>
              <Typography variant="h4">₹{totalDisbursedAmount}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper
              elevation={3}
              sx={{ p: 3, bgcolor: "#f59e0b", color: "white" }}
            >
              <Typography variant="h6">Active Loans</Typography>
              <Typography variant="h4">{totalApprovedLoans}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper
              elevation={3}
              sx={{ p: 3, bgcolor: "#ef4444", color: "white" }}
            >
              <Typography variant="h6">Pending Loans</Typography>
              <Typography variant="h4">{totalPendingLoans}</Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Tab Content */}
        {activeTab === "users" && (
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Users
            </Typography>
            <List>
              {users.map((user) => (
                <ListItem
                  key={user.id}
                  sx={{ display: "flex", justifyContent: "space-between" }}
                >
                  <ListItemText
                    primary={user.email}
                    secondary={
                      <>
                        <span>{`User Id: ${user.id}`} </span>
                        <br />
                        <span>
                          {`User Name: ${user.firstName}  ${user.lastName}`}{" "}
                        </span>
                        <br />
                        <span>{`Role: ${user.role}`}</span>
                      </>
                    }
                  />
                  {user.role !== "admin" && (
                    <Button
                      component={Link}
                      to={`/admin/user-loan/${user.id}`}
                      variant="contained"
                      color="primary"
                      sx={{ cursor: "pointer" }}
                    >
                      View Loan Application
                    </Button>
                  )}
                </ListItem>
              ))}
            </List>
          </Paper>
        )}

        {activeTab === "loans" && (
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Pending Loan Applications
            </Typography>
            <List>
              {pendingLoans.map((loan) => (
                <ListItem key={loan.id} divider>
                  <ListItemText
                    primary={`User: ${loan.userId}`}
                    secondary={
                      <>
                        <span>Amount: ₹{loan.loanAmount}</span>
                        <br />
                        <span>Status: {loan.email}</span>
                        <br />
                        <span>Loan Type: {loan.loanType}</span>
                        <br />
                        <span>
                          Created At:{" "}
                          {new Date(
                            loan.createdAt.seconds * 1000
                          ).toLocaleDateString()}
                        </span>
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        )}

        {activeTab === "payments" && (
          <Paper elevation={3} sx={{ p: 3 }}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={3}
            >
              <Typography variant="h5" fontWeight="bold">
                Payment Verifications
              </Typography>
              <Chip
                label={`${pendingLoans.length} Pending`}
                color="warning"
                variant="outlined"
              />
            </Box>
            <AdminPaymentVerification />
            <Box mt={3}>
              <Typography variant="body2" color="text.secondary">
                Note: Verify payments by checking UTR numbers against bank
                records
              </Typography>
            </Box>
          </Paper>
        )}

        {activeTab === "approved" && (
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Approved Loans
            </Typography>
            <List>
              {approvedLoans.map((loan) => (
                <ListItem key={loan.id}>
                  <ListItemText
                    primary={`User: ${loan.userId}`}
                    secondary={
                      <>
                        {`Full Name:${loan.fullName} `}
                        <br />
                        {`Loan Type: ${loan.loanType}`}
                        <br />
                        {`Amount: ₹${loan.loanAmount}`}
                        <br />
                        {`EmiAmount:${loan.emi?.emiAmount || "N/A"}/per Month`}
                        <br />
                        {`Duration:${loan.emi?.duration || "N/A"} Months`}
                        <br />
                        {`Interest Rate:${loan.emi?.interestRate || "N/A"}`}
                        <br />
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        )}
      </Box>
    </Box>
  );
};

export default Dashboard;
