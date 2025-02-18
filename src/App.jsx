import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./components/firebaseConfig";

import HomePage from "./components/pages/home/Hompage";
import Navbar from "./components/nav/Navbar";
import Carousel from "./components/pages/home/Cerausel";
import Footer from "./components/footer/Footer";
import About from "./components/pages/about/About";
import Contact from "./components/pages/contact/Contact";
import NotFound from "./components/pages/NotFound.jsx";
import FaQ from "./components/pages/FaQ.jsx";
import PrivacyPolicy from "./components/pages/PrvacyPolicy.jsx";
import Signup from "./components/auth/Signup.jsx";
import Login from "./components/auth/Login.jsx";
import TermsAndConditions from "./components/pages/TermsAndCondition.jsx";
import AllLoans from "./components/pages/loans/AllLoans.jsx";
import PhoneLogin from "./components/auth/PhoneLogin.jsx";
import Profile from "./components/profile/Profile.jsx";
import Dashboard from "./components/pages/dashboard/Dashboard.jsx";
import ProtectedRoute from "./components/ProtectedRout.jsx";
import HomeLoanForm from "./components/pages/loans/HomeLoanForm.jsx";
import LoanSelection from "./components/pages/loans/LoanSelection.jsx";
import GoldLoanForm from "./components/pages/loans/GoldLoanForm.jsx";
import PersonalLoanForm from "./components/pages/loans/PersonalLoanForm.jsx";
import PublicRoute from "./components/PublicRoute.jsx"; // <-- Import PublicRoute
import UserLoanApplications from "./components/pages/UserLoanApplications.jsx";

function App() {
  // const [darkMode, setDarkMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user); // If user exists, set to true; otherwise, false
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, []);


  return (
    <Router>
      <div className={`flex flex-col min-h-screen`}>
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
            <Route
              path="/terms-and-conditions"
              element={<TermsAndConditions />}
            />

            {/* Authentication */}
            <Route
              path="/signup"
              element={
                <PublicRoute isAuthenticated={isAuthenticated}>
                  <Signup />
                </PublicRoute>
              }
            />
            <Route
              path="/login"
              element={
                <PublicRoute isAuthenticated={isAuthenticated}>
                  <Login />
                </PublicRoute>
              }
            />
            <Route path="/sign-in-with-mobile" element={<PhoneLogin />} />

            {/* User Pages */}
            <Route path="/profile" element={<Profile />} />
            <Route path="/loan-types" element={<AllLoans />} />

         
                <Route path="/admin-dashboard" element={<Dashboard />} />

            <Route
              element={<ProtectedRoute isAuthenticated={isAuthenticated} />}
            >
              <Route path="/apply-loan">
                <Route index element={<LoanSelection />} />
                <Route path="personal" element={<PersonalLoanForm />} />
                <Route path="home" element={<HomeLoanForm />} />
                <Route path="gold" element={<GoldLoanForm />} />
              </Route>
              <Route path="/admin/user-loan/:userId" element={<UserLoanApplications />} />

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
