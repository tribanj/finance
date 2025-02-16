// src/components/loan/HomeLoanForm.jsx
import { useState } from 'react';
import { db, auth} from '../../firebaseConfig'; 
import { collection, addDoc } from 'firebase/firestore';// Import Firebase config

import {
  Container,
  TextField,
  Typography,
  Grid,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Checkbox,
  Button,
  Paper,
  FormGroup,
} from '@mui/material';

const HomeLoanForm = () => {
  const [values, setValues] = useState({
    fullName: '',
    dob: '',
    gender: '',
    contact: '',
    email: '',
    address: '',
    occupation: '',
    employer: '',
    income: '',
    employmentType: '',
    loanType: 'Home Loan',
    status: 'pending',
    propertyAddress: '',
    propertyType: '',
    propertyValue: '',
    loanAmount: '',
    tenure: '',
    loanPurpose: '',
    bankName: '',
    accountNumber: '',
    ifsc: '',
    aadharNumber: '', // Added Aadhaar Number
    panNumber: '', // Added PAN Number
    identityProof: false,
    addressProof: false,
    incomeProof: false,
    panCard: false,
    propertyDocuments: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const user = auth.currentUser; // Get the logged-in user
    if (!user) {
      alert('You must be logged in to submit an application.');
      return;
    }
  
    try {
      await addDoc(collection(db, 'applications'), {
        userId: user.uid, // Store user ID
        ...values, // Store form data
        createdAt: new Date(),
      });
      alert('Loan application submitted successfully!');
    } catch (error) {
      console.error('Error submitting loan application:', error);
      alert('Failed to submit application.');
    }
  };

  return (
    <Container maxWidth="md" sx={{ my: 4 }}>
      <Paper elevation={3} sx={{ p: 4, backgroundColor: '#f5f5f5', borderRadius: 3 }}>
      <Typography variant="h4" gutterBottom>
        Home Loan Application Form
      </Typography>
      <form onSubmit={handleSubmit}>
        <Typography variant="h6" gutterBottom>
          1. Applicant Details
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField fullWidth label="Full Name" name="fullName" value={values.fullName} onChange={handleChange} required />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Date of Birth"
              name="dob"
              type="date"
              value={values.dob}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl component="fieldset">
              <FormLabel component="legend">Gender</FormLabel>
              <RadioGroup row name="gender" value={values.gender} onChange={handleChange}>
                <FormControlLabel value="Male" control={<Radio />} label="Male" />
                <FormControlLabel value="Female" control={<Radio />} label="Female" />
                <FormControlLabel value="Other" control={<Radio />} label="Other" />
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Contact Number" name="contact" value={values.contact} onChange={handleChange} required />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Email Address" name="email" type="email" value={values.email} onChange={handleChange} required />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Residential Address" name="address" value={values.address} onChange={handleChange} required />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Aadhaar Number" name="aadharNumber" value={values.aadharNumber} onChange={handleChange} required />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="PAN Number" name="panNumber" value={values.panNumber} onChange={handleChange} required />
          </Grid>
        </Grid>

        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          2. Employment Details
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Occupation" name="occupation" value={values.occupation} onChange={handleChange} required />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Employer Name" name="employer" value={values.employer} onChange={handleChange} required />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Monthly Income" name="income" value={values.income} onChange={handleChange} required />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl component="fieldset">
              <FormLabel component="legend">Employment Type</FormLabel>
              <RadioGroup row name="employmentType" value={values.employmentType} onChange={handleChange}>
                <FormControlLabel value="Salaried" control={<Radio />} label="Salaried" />
                <FormControlLabel value="Self-Employed" control={<Radio />} label="Self-Employed" />
              </RadioGroup>
            </FormControl>
          </Grid>
        </Grid>

        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          3. Property Details
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField fullWidth label="Property Address" name="propertyAddress" value={values.propertyAddress} onChange={handleChange} required />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <FormLabel>Type of Property</FormLabel>
              <RadioGroup row name="propertyType" value={values.propertyType} onChange={handleChange}>
                <FormControlLabel value="Residential" control={<Radio />} label="Residential" />
                <FormControlLabel value="Commercial" control={<Radio />} label="Commercial" />
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Estimated Property Value" name="propertyValue" value={values.propertyValue} onChange={handleChange} required />
          </Grid>
        </Grid>

        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          4. Loan Details
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Loan Amount Requested" name="loanAmount" value={values.loanAmount} onChange={handleChange} required />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Preferred Tenure (in years)" name="tenure" value={values.tenure} onChange={handleChange} required />
          </Grid>
        </Grid>

        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          5. Documents Attached (Checklist)
        </Typography>
        <FormGroup>
          <FormControlLabel control={<Checkbox checked={values.identityProof} onChange={handleChange} name="identityProof" />} label="Identity Proof" />
          <FormControlLabel control={<Checkbox checked={values.addressProof} onChange={handleChange} name="addressProof" />} label="Address Proof" />
          <FormControlLabel control={<Checkbox checked={values.incomeProof} onChange={handleChange} name="incomeProof" />} label="Income Proof" />
          <FormControlLabel control={<Checkbox checked={values.panCard} onChange={handleChange} name="panCard" />} label="PAN Card" />
          <FormControlLabel control={<Checkbox checked={values.propertyDocuments} onChange={handleChange} name="propertyDocuments" />} label="Property Documents" />
        </FormGroup>

        <Button variant="contained" color="primary" type="submit" sx={{ mt: 3 }}>
          Submit Application
        </Button>
      </form>
      </Paper>
    </Container>
  );
};

export default HomeLoanForm;
