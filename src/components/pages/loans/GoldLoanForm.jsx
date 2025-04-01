import { useState } from "react";
import { db, auth } from "../../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
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

const GoldLoanForm = () => {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    fullName: "",
    dob: "",
    gender: "",
    contact: "",
    email: "",
    address: "",
    adharNo: "",
    panNo: "",
    goldType: "",
    totalWeight: "",
    purity: "",
    estimatedValue: "",
    loanAmount: "",
    loanType: "Gold Loan",
    status: "pending",
    tenure: "",
    bankName: "",
    accountNumber: "",
    ifsc: "",
    identityProof: false,
    addressProof: false,
    goldItemDetails: false,
    panCard: false,
  });

  setValues({
    fullName: "",
    dob: "",
    gender: "",
    contact: "",
    email: "",
    address: "",
    adharNo: "",
    panNo: "",
    goldType: "",
    totalWeight: "",
    purity: "",
    estimatedValue: "",
    loanAmount: "",
    loanType: "",
    status: "",
    tenure: "",
    bankName: "",
    accountNumber: "",
    ifsc: "",
  });

  navigate("/profile");
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = auth.currentUser; // Get the logged-in user
    if (!user) {
      alert("You must be logged in to submit an application.");
      return;
    }

    try {
      await addDoc(collection(db, "applications"), {
        userId: user.uid, // Store user ID
        ...values, // Store form data
        createdAt: new Date(),
      });
      alert("Loan application submitted successfully!");
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
          Gold Loan Application Form
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
                name="adharNo"
                value={values.adharNo}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="PAN Number"
                name="panNo"
                value={values.panNo}
                onChange={handleChange}
                required
              />
            </Grid>
          </Grid>

          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            2. Gold Details
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl component="fieldset">
                <FormLabel component="legend">Type of Gold</FormLabel>
                <RadioGroup
                  row
                  name="goldType"
                  value={values.goldType}
                  onChange={handleChange}
                >
                  <FormControlLabel
                    value="Ornaments"
                    control={<Radio />}
                    label="Ornaments"
                  />
                  <FormControlLabel
                    value="Coins"
                    control={<Radio />}
                    label="Coins"
                  />
                  <FormControlLabel
                    value="Bars"
                    control={<Radio />}
                    label="Bars"
                  />
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Total Weight (in grams)"
                name="totalWeight"
                value={values.totalWeight}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Purity (in karats)"
                name="purity"
                value={values.purity}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Estimated Value"
                name="estimatedValue"
                value={values.estimatedValue}
                onChange={handleChange}
                required
              />
            </Grid>
          </Grid>

          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            3. Documents Attached (Checklist)
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
                  checked={values.goldItemDetails}
                  onChange={handleChange}
                  name="goldItemDetails"
                />
              }
              label="Gold Item Details (Invoice/Weight Certificate)"
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

export default GoldLoanForm;
