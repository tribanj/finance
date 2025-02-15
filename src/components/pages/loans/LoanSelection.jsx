// src/components/loan/LoanSelection.jsx
// import from 'react';
import { Grid, Card, CardContent, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const LoanSelection = () => {
  return (
    <Grid container spacing={4} justifyContent="center" sx={{ marginTop: 4 }}>
      <Grid item xs={12} sm={4}>
        <Card variant="outlined">
          <CardContent>
            <Typography variant="h5" component="div">
              Personal Loan
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ marginY: 1 }}>
              Apply for a personal loan.
            </Typography>
          </CardContent>
          <Button
            component={Link}
            to="personal"
            variant="contained"
            color="primary"
            sx={{ m: 2 }}
          >
            Select Personal Loan
          </Button>
        </Card>
      </Grid>
      <Grid item xs={12} sm={4}>
        <Card variant="outlined">
          <CardContent>
            <Typography variant="h5" component="div">
              Home Loan
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ marginY: 1 }}>
              Apply for a home loan.
            </Typography>
          </CardContent>
          <Button
            component={Link}
            to="home"
            variant="contained"
            color="primary"
            sx={{ m: 2 }}
          >
            Select Home Loan
          </Button>
        </Card>
      </Grid>
      <Grid item xs={12} sm={4}>
        <Card variant="outlined">
          <CardContent>
            <Typography variant="h5" component="div">
              Gold Loan
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ marginY: 1 }}>
              Apply for a gold loan.
            </Typography>
          </CardContent>
          <Button
            component={Link}
            to="gold"
            variant="contained"
            color="primary"
            sx={{ m: 2 }}
          >
            Select Gold Loan
          </Button>
        </Card>
      </Grid>
    </Grid>
  );
};

export default LoanSelection;
