// src/components/loan/PersonalLoanForm.jsx
import { db, auth } from "../../firebaseConfig";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { useState } from "react";
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
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const PersonalLoanForm = () => {
  const [values, setValues] = useState({
    fullName: "",
    dob: "",
    gender: "",
    contact: "",
    email: "",
    address: "",
    occupation: "",
    employer: "",
    income: "",
    employmentType: "",
    loanType: "Personal Loan",
    status: "pending",
    loanAmount: "",
    loanPurpose: "",
    tenure: "",
    bankName: "",
    accountNumber: "",
    ifsc: "",
    aadharNumber: "", // Added Aadhaar Number
    panNumber: "", // Added PAN Number
    identityProof: false,
    addressProof: false,
    incomeProof: false,
    panCard: false,
  });
  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    // Ensure this is async
    e.preventDefault();

    const user = auth.currentUser;
    if (!user) {
      alert("You must be logged in to submit an application.");
      return;
    }

    try {
      const applicationsRef = collection(db, "applications");
      const loansRef = collection(db, "loans");

      const pendingQuery = query(
        applicationsRef,
        where("userId", "==", user.uid),
        where("status", "in", ["pending", "approved"])
      );
      const activeQuery = query(
        loansRef,
        where("userId", "==", user.uid),
        where("status", "==", "active")
      );

      // 🔹 Use await correctly inside async function
      const pendingApplications = await getDocs(pendingQuery);
      const activeLoans = await getDocs(activeQuery);

      if (!pendingApplications.empty || !activeLoans.empty) {
        alert("You already have an active or pending loan application.");
        return;
      }

      await addDoc(collection(db, "applications"), {
        userId: user.uid,
        ...values,
        createdAt: new Date(),
      });

      alert("Loan application submitted successfully!");

      setValues({
        fullName: "",
        dob: "",
        gender: "",
        contact: "",
        email: "",
        address: "",
        occupation: "",
        employer: "",
        income: "",
        employmentType: "",
        loanType: "Personal Loan",
        status: "pending",
        loanAmount: "",
        loanPurpose: "",
        tenure: "",
        bankName: "",
        accountNumber: "",
        ifsc: "",
        aadharNumber: "",
        panNumber: "",
        identityProof: false,
        addressProof: false,
        incomeProof: false,
        panCard: false,
      });

      navigate("/profile");
    } catch (error) {
      console.error("Error submitting loan application:", error);
      alert("Failed to submit application.");
    }
  };

  return (
    <Container maxWidth="md" sx={{ my: 4 }}>
      <Paper
        elevation={3}
        sx={{ p: 4, backgroundColor: "#f5f5f5", borderRadius: 3 }}
      >
        <Typography variant="h4" gutterBottom>
          Personal Loan Application Form
        </Typography>
        <form onSubmit={handleSubmit}>
          <Typography variant="h6" gutterBottom>
            1. Applicant Details
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Full Name"
                name="fullName"
                value={values.fullName}
                onChange={handleChange}
                required
              />
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
                <RadioGroup
                  row
                  name="gender"
                  value={values.gender}
                  onChange={handleChange}
                >
                  <FormControlLabel
                    value="Male"
                    control={<Radio />}
                    label="Male"
                  />
                  <FormControlLabel
                    value="Female"
                    control={<Radio />}
                    label="Female"
                  />
                  <FormControlLabel
                    value="Other"
                    control={<Radio />}
                    label="Other"
                  />
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Contact Number"
                name="contact"
                value={values.contact}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email Address"
                name="email"
                type="email"
                value={values.email}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Residential Address"
                name="address"
                value={values.address}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Aadhaar Number"
                name="aadharNumber"
                value={values.aadharNumber}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="PAN Number"
                name="panNumber"
                value={values.panNumber}
                onChange={handleChange}
                required
              />
            </Grid>
          </Grid>

          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            2. Employment Details
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Occupation"
                name="occupation"
                value={values.occupation}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Employer Name"
                name="employer"
                value={values.employer}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Monthly Income"
                name="income"
                value={values.income}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl component="fieldset">
                <FormLabel component="legend">Employment Type</FormLabel>
                <RadioGroup
                  row
                  name="employmentType"
                  value={values.employmentType}
                  onChange={handleChange}
                >
                  <FormControlLabel
                    value="Salaried"
                    control={<Radio />}
                    label="Salaried"
                  />
                  <FormControlLabel
                    value="Self-Employed"
                    control={<Radio />}
                    label="Self-Employed"
                  />
                </RadioGroup>
              </FormControl>
            </Grid>
          </Grid>

          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            3. Loan Details
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Loan Amount Requested"
                name="loanAmount"
                value={values.loanAmount}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Preferred Tenure (months/years)"
                name="tenure"
                value={values.tenure}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Loan Purpose"
                name="loanPurpose"
                value={values.loanPurpose}
                onChange={handleChange}
                required
              />
            </Grid>
          </Grid>

          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            4. Bank Account Details
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Bank Name"
                name="bankName"
                value={values.bankName}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Account Number"
                name="accountNumber"
                value={values.accountNumber}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="IFSC Code"
                name="ifsc"
                value={values.ifsc}
                onChange={handleChange}
                required
              />
            </Grid>
          </Grid>

          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            5. Documents Attached (Checklist)
          </Typography>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={values.identityProof}
                  onChange={handleChange}
                  name="identityProof"
                />
              }
              label="Identity Proof (Aadhaar/Passport/Driving License)"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={values.addressProof}
                  onChange={handleChange}
                  name="addressProof"
                />
              }
              label="Address Proof (Utility Bill/Rental Agreement)"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={values.incomeProof}
                  onChange={handleChange}
                  name="incomeProof"
                />
              }
              label="Income Proof (Salary Slip/Bank Statements)"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={values.panCard}
                  onChange={handleChange}
                  name="panCard"
                />
              }
              label="PAN Card"
            />
          </FormGroup>

          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            6. Declaration
          </Typography>
          <Typography variant="body1" gutterBottom>
            I hereby declare that the information provided above is true and
            accurate to the best of my knowledge. I understand that any false
            information may lead to rejection of my loan application.
          </Typography>

          <Button
            variant="contained"
            color="primary"
            type="submit"
            sx={{ mt: 3 }}
          >
            Submit Application
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default PersonalLoanForm;
