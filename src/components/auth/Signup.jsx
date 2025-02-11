import { useState } from "react";
// import { signupUser } from "../auth/AuthService";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebaseConfig";

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "job_seeker",
    address: "",
    mobileNumber: "",
    alternativeMobileNumber: "",
    pinCode: "",
    highestEducation: "",
    workExperience: "",
    approved: false,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async () => {
    try {
      let waitingNumber = null;
      if (formData.role === "job_seeker") {
        waitingNumber = Math.floor(Math.random() * 10) + 30;
      }

      const userData = {
        ...formData,
        waitingNumber,
        createdAt: serverTimestamp(),
      };

      const userCredential = await signupUser(userData);
      const userDocRef = doc(db, "users", userCredential.user.uid);
      const existingUser = await getDoc(userDocRef);

      if (!existingUser.exists()) {
        await setDoc(userDocRef, userData);
      }
      alert("Signup successful!g")
      toast.success("Signup successful!", { position: "top-right" });
      navigate("/login");
    } catch (error) {
      alert("All Fields Are Mendatory")
      toast.error("All Fields Are Mendatory", { position: "top-right" });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-4 mt-20">
      <div className="w-full max-w-2xl bg-slate-700 rounded-xl shadow-2xl p-8 space-y-6 transform transition-all duration-300 hover:scale-105">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Create Your Account
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="relative">
            <input
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-purple-500 transition-all duration-300"
              required
            />
          </div>
          <div className="relative">
            <input
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-purple-500 transition-all duration-300"
              required
            />
          </div>
          <div className="relative sm:col-span-2">
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-purple-500 transition-all duration-300"
              required
            />
          </div>
          <div className="relative sm:col-span-2">
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-purple-500 transition-all duration-300"
              required
            />
          </div>
          <div className="relative sm:col-span-2">
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-purple-500 transition-all duration-300"
              required
            >
              <option value="employer" disabled>
                User
              </option>
              <option value="job_seeker">Admin</option>
            </select>
          </div>
          <div className="relative sm:col-span-2">
            <input
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-purple-500 transition-all duration-300"
              required
            />
          </div>
          <div className="relative">
            <input
              name="mobileNumber"
              placeholder="Mobile Number"
              value={formData.mobileNumber}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-purple-500 transition-all duration-300"
              required
            />
          </div>
          <div className="relative">
            <input
              name="alternativeMobileNumber"
              placeholder="Alternative Mobile Number"
              value={formData.alternativeMobileNumber}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-purple-500 transition-all duration-300"
              required
            />
          </div>
          <div className="relative">
            <input
              name="pinCode"
              placeholder="Pin Code"
              value={formData.pinCode}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-purple-500 transition-all duration-300"
              required
            />
          </div>
          <div className="relative">
            <input
              name="highestEducation"
              placeholder="Highest Education"
              value={formData.highestEducation}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-purple-500 transition-all duration-300"
              required
            />
          </div>
          <div className="relative">
            <input
              name="workExperience"
              placeholder="Work Experience"
              value={formData.workExperience}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-purple-500 transition-all duration-300"
              required
            />
          </div>
        </div>
        <button
          onClick={handleSignup}
          className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 rounded-lg font-semibold shadow-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105"
        >
          Signup
        </button>
        <p className="text-sm text-center text-gray-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-purple-500 hover:text-purple-600 cursor-pointer font-semibold"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;