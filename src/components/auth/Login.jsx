import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (email === "admin@lcmf.com") {
        toast.success("Welcome, Admin!", { position: "top-right" });
        navigate("/admin-dashboard");
      } else {
        toast.success("Welcome back, User!", { position: "top-right" });
        navigate("/login");
      }
    } catch (error) {
      toast.error("Invalid credentials. Please try again.", { position: "top-right" });
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
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-purple-500 transition-all duration-300"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-purple-500 transition-all duration-300"
            required
          />
        </div>
        <button
          onClick={handleLogin}
          className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 rounded-lg font-semibold shadow-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105"
        >
          Login
        </button>
        <p className="text-sm text-center text-gray-400">
          Don't have an account? {" "}
          <Link to="/signup" className="text-purple-300 hover:text-purple-400 cursor-pointer font-semibold">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
