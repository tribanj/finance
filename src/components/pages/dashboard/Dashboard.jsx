import { useState, useEffect } from "react";
import { db } from "../../firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import useAdminCheck from "../../hooks/useAdminCheck"; // Import the admin check hook
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
} from "@mui/material";
import {
  People as UsersIcon,
  RequestPage as LoansIcon,
  Notifications as NotificationsIcon,
  Paid as PaymentsIcon,
  CheckCircle as ApprovedIcon,
} from "@mui/icons-material";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const isAdmin = useAdminCheck(); // Check if the user is an admin
  const [users, setUsers] = useState([]);
  const [pendingLoans, setPendingLoans] = useState([]);
  const [approvedLoans, setApprovedLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("users"); // Default active tab

  useEffect(() => {
    if (isAdmin) {
      fetchData();
    } else {
      setLoading(false); // Stop loading if user is not admin
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

  // Fetch all users
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

  // Fetch pending loan applications
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

  // Fetch approved loans
  const fetchApprovedLoans = async () => {
    try {
      const loansSnapshot = await getDocs(collection(db, "loans"));
      const approvedLoansList = loansSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setApprovedLoans(approvedLoansList);
      // console.log("============>", approvedLoansList);
    } catch (error) {
      setError("Error fetching approved loans.");
      console.error("Error fetching approved loans:", error);
    }
  };

  // Calculate statistics
  const totalUsers = users.length;
  const totalPendingLoans = pendingLoans.length;
  const totalApprovedLoans = approvedLoans.length;
  const totalDisbursedAmount = approvedLoans.reduce(
    (sum, loan) => sum + loan.amount,
    0
  );

  if (!isAdmin) {
    return <p>Access Denied. You must be an admin to view this page.</p>;
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
    return <p>{error}</p>;
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
              }}
            >
              <ListItemIcon>
                <PaymentsIcon sx={{ color: "white" }} />
              </ListItemIcon>
              <ListItemText primary="Payments" />
            </ListItem>
            <ListItem
              button
              onClick={() => setActiveTab("notifications")}
              sx={{
                bgcolor:
                  activeTab === "notifications" ? "#334155" : "transparent",
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
        <Paper elevation={3} sx={{ p: 3 }}>
          {activeTab === "users" && (
            <>
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
                    {/* View Loan Applications Button */}
                    {user.role !== "admin" && (
                      <Button
                        component={Link}
                        to={`/admin/user-loan/${user.id}`}
                        variant="contained"
                        color="primary"
                      >
                        View Loan Application
                      </Button>
                    )}
                  </ListItem>
                ))}
              </List>
            </>
          )}
          {activeTab === "loans" && (
            <>
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
            </>
          )}
          {activeTab === "approved" && (
            <>
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
                          {`EmiAmount:${loan.emi.emiAmount}/per Month`}
                          <br />
                          {`Duration:${loan.emi.duration} Months`}
                          <br />
                          {`Intrest Rate:${loan.emi.interestRate}`}
                          <br />
                        </>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </>
          )}
        </Paper>
      </Box>
    </Box>
  );
};

export default Dashboard;
