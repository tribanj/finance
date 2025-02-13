import { Card, CardContent, Typography, Grid } from "@mui/material";
import { useCollection } from "react-firebase-hooks/firestore";
import { collection } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import Chart from "react-apexcharts";

const Dashboard = () => {
  const [applications] = useCollection(collection(db, "applications"));
  const [payments] = useCollection(collection(db, "payments"));

  // Statistics Cards
  const stats = [
    { title: "Total Applications", value: applications?.size || 0 },
    {
      title: "Pending Payments",
      value:
        payments?.docs.filter((p) => p.data().status === "pending").length || 0,
    },
    {
      title: "Active Loans",
      value:
        applications?.docs.filter((a) => a.data().status === "approved")
          .length || 0,
    },
    { title: "Support Tickets", value: 15 }, // Add actual data
  ];
  console.log("I am from admin dashboard",stats);
  // Chart Configuration
  const chartOptions = {
    chart: {
      type: "donut",
      height: 350,
    },
    labels: ["Approved", "Pending", "Rejected"],
    colors: ["#10B981", "#FBBF24", "#EF4444"],
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <Grid container spacing={3}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl shadow-lg">
              <CardContent>
                <Typography variant="h6" color="textSecondary">
                  {stat.title}
                </Typography>
                <Typography variant="h4" className="font-bold text-gray-800">
                  {stat.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card className="rounded-xl shadow-lg">
            <CardContent>
              <Chart
                options={chartOptions}
                series={[45, 30, 25]}
                type="donut"
                height={350}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default Dashboard;
