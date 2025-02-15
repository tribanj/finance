// src/components/loan/PersonalLoanForm.jsx
import { useState } from 'react';
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
  FormGroup,
} from '@mui/material';

const PersonalLoanForm = () => {
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
    loanAmount: '',
    loanPurpose: '',
    tenure: '',
    bankName: '',
    accountNumber: '',
    ifsc: '',
    identityProof: false,
    addressProof: false,
    incomeProof: false,
    panCard: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Process the application submission
    console.log(values);
  };

  return (
    <Container maxWidth="md" sx={{ my: 4 }}>
      <Typography variant="h4" gutterBottom>
        Personal Loan Application Form
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
          3. Loan Details
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Loan Amount Requested" name="loanAmount" value={values.loanAmount} onChange={handleChange} required />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Preferred Tenure (months/years)" name="tenure" value={values.tenure} onChange={handleChange} required />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Loan Purpose" name="loanPurpose" value={values.loanPurpose} onChange={handleChange} required />
          </Grid>
        </Grid>

        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          4. Bank Account Details
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField fullWidth label="Bank Name" name="bankName" value={values.bankName} onChange={handleChange} required />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField fullWidth label="Account Number" name="accountNumber" value={values.accountNumber} onChange={handleChange} required />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField fullWidth label="IFSC Code" name="ifsc" value={values.ifsc} onChange={handleChange} required />
          </Grid>
        </Grid>

        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          5. Documents Attached (Checklist)
        </Typography>
        <FormGroup>
          <FormControlLabel
            control={<Checkbox checked={values.identityProof} onChange={handleChange} name="identityProof" />}
            label="Identity Proof (Aadhaar/Passport/Driving License)"
          />
          <FormControlLabel
            control={<Checkbox checked={values.addressProof} onChange={handleChange} name="addressProof" />}
            label="Address Proof (Utility Bill/Rental Agreement)"
          />
          <FormControlLabel
            control={<Checkbox checked={values.incomeProof} onChange={handleChange} name="incomeProof" />}
            label="Income Proof (Salary Slip/Bank Statements)"
          />
          <FormControlLabel
            control={<Checkbox checked={values.panCard} onChange={handleChange} name="panCard" />}
            label="PAN Card"
          />
        </FormGroup>

        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          6. Declaration
        </Typography>
        <Typography variant="body1" gutterBottom>
          I hereby declare that the information provided above is true and accurate to the best of my knowledge. I understand that any false information may lead to rejection of my loan application.
        </Typography>

        <Button variant="contained" color="primary" type="submit" sx={{ mt: 3 }}>
          Submit Application
        </Button>
      </form>
    </Container>
  );
};

export default PersonalLoanForm;
