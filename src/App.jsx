import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/pages/home/Hompage";
import Navbar from "./components/nav/Navbar";
import Carousel from "./components/pages/home/Cerausel";
import Footer from "./components/footer/Footer";
import About from "./components/pages/about/About"; // Create this component
import Contact from "./components/pages/contact/Contact"; // Create this component
import NotFound from "./components/pages/NotFound.jsx"; // Optional: Create this component
import FaQ from "./components/pages/FaQ.jsx";
import PrivacyPolicy from "./components/pages/PrvacyPolicy.jsx";
import Signup from "./components/auth/Signup.jsx";
import Login from "./components/auth/Login.jsx";
import TermsAndConditions from "./components/pages/TermsAndCondition.jsx";
import LoanForm from "./components/loan/LoanForm.jsx";
import AllLoans from "./components/pages/loans/AllLoans.jsx";
import PhoneLogin from "./components/auth/PhoneLogin.jsx";
import Profile from "./components/profile/Profile.jsx";
import Dashboard from "./components/pages/dashboard/Dashboard.jsx";
import DashboardLayout from "./components/pages/dashboard/DashboardLayout.jsx";
import { useState } from "react";
function App() {
  const [darkMode, setDarkMode] = useState(false);

  // Function to toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  return (
    <Router>
      <div className={`flex flex-col min-h-screen ${darkMode ? "dark" : ""}`}>
        {/* Navbar */}
        <Navbar />

        {/* Main Content */}
        <main className="flex-grow pt-20">
          <Routes>
            {/* Public Pages */}
            <Route
              path="/"
              element={
                <>
                  <Carousel />
                  <HomePage />
                </>
              }
            />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FaQ />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-and-conditions" element={<TermsAndConditions />} />

            {/* Authentication */}
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/sign-in-with-mobile" element={<PhoneLogin />} />

            {/* User Pages */}
            <Route path="/profile" element={<Profile />} />
            <Route path="/apply-loan" element={<LoanForm />} />
            <Route path="/loans" element={<AllLoans />} />

            {/* Admin Dashboard (Wrapped with DashboardLayout) */}
            <Route
              path="/admin-dashboard"
              element={<DashboardLayout darkMode={darkMode} toggleDarkMode={toggleDarkMode} />}
            >
              <Route index element={<Dashboard />} />
              {/* Future admin routes can be added here */}
            </Route>

            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        {/* Footer */}
        <hr className="border-t-2 border-cyan-500" />
        <Footer />
      </div>
    </Router>
  );
}

export default App;