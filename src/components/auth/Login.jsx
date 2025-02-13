import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      // Sign in with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Retrieve user role from Firestore
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);
      let role = "";
      if (userDocSnap.exists()) {
        role = userDocSnap.data().role;
      }

      // If the email matches the hardcoded admin email, override role
      if (email === "admin@lcmf.com") {
        toast.success("Welcome, Admin! Check it now.", { position: "top-right" });
        navigate("/admin-dashboard");
        return;
      }

      if (role === "employer") {
        toast.success("Welcome back, Employer!", { position: "top-right" });
        navigate("/profile");
      } else if (role === "job_seeker") {
        toast.success("Welcome back, Job Seeker!", { position: "top-right" });
        navigate("/career");
      } else {
        toast.error("Invalid role detected. Please contact support.", { position: "top-right" });
      }
    } catch (error) {
      toast.error("Error in login. Please check your credentials!", { position: "top-right" });
      console.error("Login error:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-4">
      <ToastContainer />

      <div className="w-full max-w-md bg-slate-700 rounded-xl shadow-2xl p-8 space-y-6 transform transition-all duration-300 hover:scale-105">
        <div className="flex flex-col items-center">
          <div className="w-32 h-32 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center mb-6">
            <FaUser className="text-white text-6xl" />
          </div>
          <h2 className="text-3xl font-bold text-center text-gray-100 mb-6">
            Welcome Back!
          </h2>
        </div>
        <div className="space-y-4">
          <div className="relative">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-purple-500 transition-all duration-300"
              required
            />
            <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
            </span>
          </div>
          <div className="relative">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-purple-500 transition-all duration-300"
              required
            />
            <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
            </span>
          </div>
        </div>
        <button
          onClick={handleLogin}
          className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 rounded-lg font-semibold shadow-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105"
        >
          Login
        </button>
        <Link
          to="/sign-in-with-mobile"
          className="w-full block bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 rounded-lg font-semibold shadow-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 text-center"
        >
          Login with Phone Number
        </Link>
        <p className="text-sm text-center text-gray-400">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-purple-300 hover:text-purple-400 cursor-pointer font-semibold"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
