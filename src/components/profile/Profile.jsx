import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebaseConfig";
import { signOut, sendPasswordResetEmail } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import Loading from "../Loadder";

const Profile = () => {
  const [user, loading] = useAuthState(auth);
  const [loanApplications, setLoanApplications] = useState([]);
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
          toast.error("Error fetching user role.", err, {
            position: "top-right",
          });
        }
      };

      fetchUserRole();
    }
  }, [user]);

  // Fetch all loan applications (both pending & approved)
  useEffect(() => {
    if (user && !isAdmin) {
      const fetchLoanApplications = async () => {
        try {
          const loansRef = collection(db, "applications");
          const q = query(loansRef, where("userId", "==", user.uid));
          const querySnapshot = await getDocs(q);
          const loans = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setLoanApplications(loans);
        } catch (err) {
          toast.error("Error fetching loan applications.", err, {
            position: "top-right",
          });
        }
      };

      fetchLoanApplications();
    }
  }, [user, isAdmin]);

  if (loading) {
    return <Loading />;
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
      toast.error("Error logging out. Try again.", err, {
        position: "top-right",
      });
    }
  };

  const handleResetPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, user.email);
      toast.success("Password reset email sent!", { position: "top-right" });
    } catch (err) {
      toast.error("Error sending password reset email.", err, {
        position: "top-right",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center p-4">
      <ToastContainer />
      <div className="bg-slate-950 bg-opacity-10 backdrop-blur-lg rounded-xl shadow-2xl p-8 max-w-6xl w-full text-white grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column: User Details */}
        <div className="flex flex-col items-center">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-6xl font-bold text-white mb-6 shadow-lg">
            {user.displayName
              ? user.displayName.charAt(0).toUpperCase()
              : user.email.charAt(0).toUpperCase()}
          </div>
          <h1 className="text-4xl font-bold text-center mb-4">
            {user.displayName || "User"}
          </h1>
          <p className="text-center mb-2 text-gray-200">
            <strong>Email:</strong> {user.email}
          </p>
          <p className="text-center mb-2 text-gray-200">
            <strong>User ID:</strong> {user.uid}
          </p>
          <p className="text-center mb-2 text-gray-200">
            <strong>Role:</strong>{" "}
            <span
              className={`font-semibold ${
                isAdmin ? "text-green-400" : "text-yellow-400"
              }`}
            >
              {isAdmin ? "Admin" : "User"}
            </span>
          </p>
          <div className="flex flex-col space-y-4 mt-6 w-full">
            <button
              onClick={handleLogout}
              className="w-full bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 py-3 rounded-full text-white font-semibold transition-all duration-300 transform hover:scale-105"
            >
              Logout
            </button>
            <button
              onClick={handleResetPassword}
              className="w-full bg-gradient-to-r from-yellow-500 to-yellow-700 hover:from-yellow-600 hover:to-yellow-800 py-3 rounded-full text-white font-semibold transition-all duration-300 transform hover:scale-105"
            >
              Reset Password
            </button>
          </div>
        </div>

        {/* Right Column: Admin Dashboard OR Loan Applications */}
        <div className="bg-slate-950 bg-opacity-10 backdrop-blur-lg rounded-xl p-6">
          {isAdmin ? (
            <div className="flex flex-col items-center">
              <h2 className="text-3xl font-bold mb-6 text-center text-white">
                Admin Panel
              </h2>
              <button
                onClick={() => navigate("/admin-dashboard")}
                className="bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 py-3 px-6 rounded-full text-white font-semibold transition-all duration-300 transform hover:scale-105"
              >
                Go to Admin Dashboard
              </button>
            </div>
          ) : (
            <>
              <h2 className="text-3xl font-bold mb-6 text-center text-white">
                My Loan Applications
              </h2>
              {loanApplications.length > 0 ? (
                <div className="space-y-4">
                  {loanApplications.map((loan) => (
                    <div
                      key={loan.id}
                      className={`p-6 rounded-xl shadow-md backdrop-blur-lg ${
                        loan.status === "approved"
                          ? "bg-gradient-to-r from-green-400 to-green-600"
                          : "bg-gradient-to-r from-yellow-400 to-yellow-600"
                      }`}
                    >
                      <p className="font-semibold text-white">
                        Loan Amount: ₹{loan.loanAmount}
                      </p>
                      <p className="text-white">Tenure: {loan.tenure} months</p>
                      <p className="text-white">
                        Status:{" "}
                        <span
                          className={`font-bold ${
                            (loan.status || "pending") === "approved"
                              ? "text-green-900"
                              : "text-yellow-900"
                          }`}
                        >
                          {(loan.status || "pending").toUpperCase()}
                        </span>
                      </p>
                      <p className="text-white">
                        Applied On:{" "}
                        {loan.createdAt && loan.createdAt.toDate
                          ? loan.createdAt.toDate().toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-300">
                  No loan applications found.
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
