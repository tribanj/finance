import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import {
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  Box,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import { toast } from 'react-toastify';

function UserDetailsPage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [loanApplications, setLoanApplications] = useState([]);
  const [approvedLoans, setApprovedLoans] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        // Fetch user details
        const userRef = doc(db, 'users', userId);
        const userSnap = await getDoc(userRef);
        
        if (!userSnap.exists()) {
          throw new Error('User not found');
        }
        
        setUser({ id: userSnap.id, ...userSnap.data() });

        // Fetch user's loan applications
        const applicationsRef = collection(db, 'applications');
        const appsQuery = query(applicationsRef, where('userId', '==', userId));
        const appsSnapshot = await getDocs(appsQuery);
        setLoanApplications(appsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        // Fetch user's approved loans
        const loansRef = collection(db, 'loans');
        const loansQuery = query(loansRef, where('userId', '==', userId));
        const loansSnapshot = await getDocs(loansQuery);
        setApprovedLoans(loansSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      } catch (err) {
        console.error('Error fetching user data:', err);
        setError(err.message);
        toast.error('Failed to load user details');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleDateString('en-IN');
    } catch {
      return 'Invalid Date';
    }
  };

  const handleBack = () => {
    navigate('/admin-dashboard');
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
        <Button variant="contained" onClick={handleBack} sx={{ mt: 2 }}>
          Back to Dashboard
        </Button>
      </Box>
    );
  }

  if (!user) {
    return (
      <Box p={3}>
        <Alert severity="warning">User not found</Alert>
        <Button variant="contained" onClick={handleBack} sx={{ mt: 2 }}>
          Back to Dashboard
        </Button>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Button 
        variant="outlined" 
        onClick={handleBack}
        sx={{ mb: 3 }}
      >
        Back to Dashboard
      </Button>

      <Typography variant="h4" gutterBottom>
        User Details
      </Typography>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {user.firstName + user.lastName|| 'No Name'} ({user.role})
          </Typography>
          <Typography>Email: {user.email}</Typography>
          <Typography>Phone: {user.mobileNumber || 'N/A'}</Typography>
          <Typography>alternative Phone: {user.alternativeMobileNumber || 'N/A'}</Typography>
          <Typography>Adhar No: {user.adharNo || 'N/A'}</Typography>
          <Typography>Address: {user.address || 'N/A'}</Typography>
          <Typography>Pin code : {user.pinCode || 'N/A'}</Typography>
          <Typography>Joined: {formatDate(user.createdAt)}</Typography>
          <Typography>Occupation: {user.occupation || 'N/A'}</Typography>
          <Typography>Pan No. : {user.panCardNo || 'N/A'}</Typography>

        </CardContent>
      </Card>

      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        Loan Applications
      </Typography>
      
      {loanApplications.length > 0 ? (
        <TableContainer component={Paper} sx={{ mb: 4 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Applied On</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loanApplications.map((app) => (
                <TableRow key={app.id}>
                  <TableCell>{app.id}</TableCell>
                  <TableCell>{app.loanType}</TableCell>
                  <TableCell>₹{app.loanAmount}</TableCell>
                  <TableCell>{app.status || 'Pending'}</TableCell>
                  <TableCell>{formatDate(app.appliedAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Alert severity="info" sx={{ mb: 4 }}>
          No loan applications found for this user
        </Alert>
      )}

      <Typography variant="h5" gutterBottom>
        Approved Loans
      </Typography>
      
      {approvedLoans.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Duration</TableCell>
                <TableCell>Interest Rate</TableCell>
                <TableCell>Approved On</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {approvedLoans.map((loan) => (
                <TableRow key={loan.id}>
                  <TableCell>{loan.id}</TableCell>
                  <TableCell>{loan.loanType}</TableCell>
                  <TableCell>₹{loan.loanAmount}</TableCell>
                  <TableCell>
                    {loan.emi?.duration || 'N/A'} months
                  </TableCell>
                  <TableCell>
                    {loan.emi?.interestRate || 'N/A'}%
                  </TableCell>
                  <TableCell>{formatDate(loan.approvedDate)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Alert severity="info">
          No approved loans found for this user
        </Alert>
      )}
    </Box>
  );
}

export default UserDetailsPage;