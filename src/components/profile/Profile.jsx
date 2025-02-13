import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebaseConfig";
import { signOut, sendPasswordResetEmail } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import Loading from "../Loadder";

const Profile = () => {
  const [user, loading] = useAuthState(auth);
  const [activeLoans, setActiveLoans] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  // Fetch user role from Firestore
  useEffect(() => {
    if (user) {
      const fetchUserRole = async () => {
        try {
          const userRef = doc(db, "users", user.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            const userData = userSnap.data();
            setIsAdmin(userData.role === "admin");
          }
        } catch (err) {
          toast.error("Error fetching user role.", { position: "top-right" });
        }
      };

      fetchUserRole();
    }
  }, [user]);

  // Fetch active loans only if user is NOT an admin
  useEffect(() => {
    if (user && !isAdmin) {
      const fetchActiveLoans = async () => {
        try {
          const loansRef = collection(db, "applications");
          const q = query(
            loansRef,
            where("userId", "==", user.uid),
            where("status", "==", "approved")
          );
          const querySnapshot = await getDocs(q);
          const loans = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setActiveLoans(loans);
        } catch (err) {
          toast.error("Error fetching loans.", { position: "top-right" });
        }
      };

      fetchActiveLoans();
    }
  }, [user, isAdmin]);

  if (loading) {
    return (
      <Loading />
    );
  }

  if (!user) {
    navigate("/login");
    return null;
  }

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out successfully!", { position: "top-right" });
      navigate("/login");
    } catch (err) {
      toast.error("Error logging out. Try again.", { position: "top-right" });
    }
  };

  const handleResetPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, user.email);
      toast.success("Password reset email sent!", { position: "top-right" });
    } catch (err) {
      toast.error("Error sending password reset email.", { position: "top-right" });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center p-4">
      <ToastContainer />
      <div className="bg-slate-500 bg-opacity-10 backdrop-blur-lg rounded-xl shadow-xl p-8 max-w-6xl w-full text-white grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column: User Details */}
        <div>
          <div className="flex items-center justify-center mb-6">
            <div className="w-24 h-24 rounded-full bg-cyan-500 flex items-center justify-center text-4xl font-bold">
              {user.displayName
                ? user.displayName.charAt(0).toUpperCase()
                : user.email.charAt(0).toUpperCase()}
            </div>
          </div>
          <h1 className="text-3xl font-bold text-center mb-4">
            {user.displayName || "User"}
          </h1>
          <p className="text-center mb-2">
            <strong>Email:</strong> {user.email}
          </p>
          <p className="text-center mb-2">
            <strong>User ID:</strong> {user.uid}
          </p>
          <p className="text-center mb-2">
            <strong>Role:</strong> {isAdmin ? "Admin" : "User"}
          </p>
          <div className="flex flex-col space-y-4 mt-6">
            <button
              onClick={handleLogout}
              className="w-full bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 py-3 rounded-full text-white font-semibold transition-all duration-300"
            >
              Logout
            </button>
            <button
              onClick={handleResetPassword}
              className="w-full bg-gradient-to-r from-yellow-500 to-yellow-700 hover:from-yellow-600 hover:to-yellow-800 py-3 rounded-full text-white font-semibold transition-all duration-300"
            >
              Reset Password
            </button>
          </div>
        </div>

        {/* Right Column: Admin Dashboard Button OR Active Loans */}
        <div>
          {isAdmin ? (
            <div className="flex flex-col items-center">
              <h2 className="text-2xl font-bold mb-6 text-center">
                Admin Panel
              </h2>
              <button
                onClick={() => navigate("/admin-dashboard")}
                className="bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 py-3 px-6 rounded-full text-white font-semibold transition-all duration-300"
              >
                Go to Admin Dashboard
              </button>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold mb-6 text-center">Active Loans</h2>
              {activeLoans.length > 0 ? (
                <div className="space-y-4">
                  {activeLoans.map((loan) => (
                    <div
                      key={loan.id}
                      className="bg-white bg-opacity-10 p-4 rounded-lg"
                    >
                      <p className="font-semibold">Loan Amount: ₹{loan.amount}</p>
                      <p>Tenure: {loan.tenure} months</p>
                      <p>Status: {loan.status}</p>
                      <p>Applied On: {new Date(loan.appliedAt).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-300">No active loans found.</p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
