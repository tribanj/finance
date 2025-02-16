// src/components/loan/LoanSelection.jsx
import { Grid, Card, CardContent, Typography, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";
import PaidIcon from "@mui/icons-material/Paid"; // Loan Icon

const LoanSelection = () => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(#0000, #0000, #2005fc)", // Background Gradient
        padding: 4,
      }}
    >
      <Grid container spacing={4} justifyContent="center" maxWidth="lg">
        {loanTypes.map((loan, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              sx={{
                borderRadius: 4,
                boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.2)", // Soft Shadow
                transition: "0.3s",
                backdropFilter: "blur(10px)", // Glass Effect
                background: "rgba(255, 255, 255, 0.1)", // Semi-transparent
                color: "#fff", // White Text
                overflow: "hidden",
                position: "relative",
                "&:hover": {
                  transform: "translateY(-8px)",
                  boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.3)", // Lift on Hover
                },
              }}
            >
              {/* Gradient Header */}
              <Box
                sx={{
                  background: "linear-gradient(135deg, #ff6a00, #ee0979)", // Vibrant Gradient
                  padding: 2,
                  textAlign: "center",
                }}
              >
                <PaidIcon sx={{ fontSize: 40, color: "#fff" }} />
                <Typography
                  variant="h5"
                  sx={{ fontWeight: "bold", marginTop: 1 }}
                >
                  {loan.title}
                </Typography>
              </Box>

              {/* Card Content */}
              <CardContent sx={{ textAlign: "center", padding: 3 }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#e0e0e0",
                    marginBottom: 2,
                    fontSize: "16px",
                  }}
                >
                  {loan.description}
                </Typography>

                {/* Select Button */}
                <Button
                  component={Link}
                  to={loan.link}
                  variant="contained"
                  sx={{
                    background: "linear-gradient(135deg, #ff6a00, #ee0979)",
                    borderRadius: 3,
                    fontWeight: "bold",
                    textTransform: "none",
                    paddingX: 3,
                    paddingY: 1,
                    "&:hover": {
                      background: "linear-gradient(135deg, #ee0979, #ff6a00)",
                    },
                  }}
                >
                  {loan.buttonText}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

// Loan Data
const loanTypes = [
  {
    title: "Personal Loan",
    description: "Get quick funds for personal use with low-interest rates.",
    link: "personal",
    buttonText: "Select Personal Loan",
  },
  {
    title: "Home Loan",
    description: "Secure your dream home with easy loan approvals.",
    link: "home",
    buttonText: "Select Home Loan",
  },
  {
    title: "Gold Loan",
    description: "Instant gold loans with flexible repayment options.",
    link: "gold",
    buttonText: "Select Gold Loan",
  },
];

export default LoanSelection;
