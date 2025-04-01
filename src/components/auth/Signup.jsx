import { useState } from "react";
import { auth, db } from "../firebaseConfig";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();

  // State for form data
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    address: "",
    mobileNumber: "",
    alternativeMobileNumber: "",
    pinCode: "",
    occupation: "",
    adharNo: "",
    panCardNo: "",
    approved: false,
  });

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const role = formData.email === "lifecomrademf143@gmail.com" ? "admin" : "user";

      // Create user with Firebase Auth (password is automatically hashed)
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      // Update user profile
      await updateProfile(userCredential.user, {
        displayName: `${formData.firstName} ${formData.lastName}`,
      });

      // Remove password before saving user data in Firestore
      const { password, ...userDataWithoutPassword } = formData;

      const userData = {
        ...userDataWithoutPassword,
        role,
        createdAt: serverTimestamp(),
      };

      // Save user data to Firestore
      const userDocRef = doc(db, "users", userCredential.user.uid);
      const existingUser = await getDoc(userDocRef);

      if (!existingUser.exists()) {
        await setDoc(userDocRef, userData);
      }

      toast.success("Signup successful!", { position: "top-right" });
      navigate("/profile");
    } catch (error) {
      toast.error("Error in signup: " + error.message, {
        position: "top-right",
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-4 mt-20">
      <div className="w-full max-w-2xl bg-slate-700 rounded-xl shadow-2xl p-8 space-y-6 transform transition-all duration-300 hover:scale-105">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Create Your Account
        </h2>
        <form
          onSubmit={handleSignup}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2"
        >
          <input
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-purple-500 transition-all duration-300"
            required
          />
          <input
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-purple-500 transition-all duration-300"
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-purple-500 transition-all duration-300 sm:col-span-2"
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-purple-500 transition-all duration-300 sm:col-span-2"
            required
          />
          <input
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-purple-500 transition-all duration-300 sm:col-span-2"
            required
          />
          <input
            name="mobileNumber"
            placeholder="Mobile Number"
            value={formData.mobileNumber}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-purple-500 transition-all duration-300"
            required
          />
          <input
            name="alternativeMobileNumber"
            placeholder="Alternative Mobile Number"
            value={formData.alternativeMobileNumber}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-purple-500 transition-all duration-300"
            required
          />
          <input
            name="pinCode"
            placeholder="Pin Code"
            value={formData.pinCode}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-purple-500 transition-all duration-300"
            required
          />
          <input
            name="adharNo"
            placeholder="Aadhaar Number"
            value={formData.adharNo}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-purple-500 transition-all duration-300 sm:col-span-2"
            required
          />
          <input
            name="panCardNo"
            placeholder="PAN Card Number"
            value={formData.panCardNo}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-purple-500 transition-all duration-300 sm:col-span-2"
            required
          />
          <input
            name="occupation"
            placeholder="Occupation"
            value={formData.occupation}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-purple-500 transition-all duration-300 sm:col-span-2"
            required
          />
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 rounded-lg font-semibold shadow-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 sm:col-span-2"
          >
            Signup
          </button>
        </form>
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
