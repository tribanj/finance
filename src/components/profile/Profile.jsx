import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebaseConfig";
import { signOut, sendPasswordResetEmail } from "firebase/auth";
import { useNavigate, useParams } from "react-router-dom";
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
  const [approvedLoans, setApprovedLoans] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [payments, setPayments] = useState([]);
  const [emiSchedules, setEmiSchedules] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const navigate = useNavigate();
  const { loanId, emiId } = useParams();

  // Fetch user role
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
          toast.error("Error fetching user role.");
        }
      };
      fetchUserRole();
    }
  }, [user]);

  // Fetch Loan Applications, Approved Loans, Payments, and EMI Schedules
  useEffect(() => {
    if (user) {
      const fetchAllData = async () => {
        try {
          // 1. Fetch user's approved loans
          const loansRef = collection(db, "loans");
          const approvedQuery = query(
            loansRef,
            where("userId", "==", user.uid)
          );
          const approvedSnapshot = await getDocs(approvedQuery);
          const approvedLoans = approvedSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            approvedAt:
              doc.data().approvedAt?.toDate?.() || doc.data().approvedAt,
          }));
          setApprovedLoans(approvedLoans);

          // 2. Fetch all EMIs for these loans
          const schedules = {};
          if (approvedLoans.length > 0) {
            const emiRef = collection(db, "emi");
            const emiQuery = query(
              emiRef,
              where(
                "loanId",
                "in",
                approvedLoans.map((loan) => loan.id)
              )
            );
            const emiSnapshot = await getDocs(emiQuery);

            // 3. Fetch installments for each EMI
            for (const emiDoc of emiSnapshot.docs) {
              const emiData = emiDoc.data();
              try {
                const instalmentsRef = collection(
                  db,
                  "emi",
                  emiDoc.id,
                  "installments"
                );
                const instalmentsSnapshot = await getDocs(instalmentsRef);
                const instalments = instalmentsSnapshot.docs.map((doc) => ({
                  id: doc.id,
                  ...doc.data(),
                  emiId: emiDoc.id,
                  loanId: emiData.loanId,
                  dueDate: doc.data().dueDate?.toDate?.() || doc.data().dueDate,
                  amount: parseFloat(doc.data().amount) || 0,
                }));

                if (!schedules[emiData.loanId]) {
                  schedules[emiData.loanId] = [];
                }
                schedules[emiData.loanId].push(...instalments);
              } catch (err) {
                console.error(
                  `Error fetching installments for EMI ${emiDoc.id}:`,
                  err
                );
              }
            }

            // Sort installments by due date for each loan
            Object.keys(schedules).forEach((loanId) => {
              schedules[loanId].sort((a, b) => {
                const dateA =
                  a.dueDate instanceof Date ? a.dueDate : new Date(a.dueDate);
                const dateB =
                  b.dueDate instanceof Date ? b.dueDate : new Date(b.dueDate);
                return dateA - dateB;
              });
            });
          }

          setEmiSchedules(schedules);

          // Fetch pending applications
          const applicationsRef = collection(db, "applications");
          const pendingQuery = query(
            applicationsRef,
            where("userId", "==", user.uid),
            where("status", "==", "pending")
          );
          const pendingSnapshot = await getDocs(pendingQuery);
          setLoanApplications(
            pendingSnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }))
          );

          // Fetch payment records
          const paymentsRef = collection(db, "payments");
          const paymentQuery = query(
            paymentsRef,
            where("userId", "==", user.uid)
          );
          const paymentSnapshot = await getDocs(paymentQuery);
          setPayments(
            paymentSnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }))
          );
        } catch (err) {
          console.error("Error fetching data:", err);
          toast.error("Error loading loan details");
        }
      };

      fetchAllData();
    }
  }, [user]);

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
      toast.success("Logged out successfully!");
      navigate("/login");
    } catch (err) {
      toast.error("Error logging out. Try again.");
    }
  };

  const handleResetPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, user.email);
      toast.success("Password reset email sent!");
    } catch (err) {
      toast.error("Error sending password reset email.");
    }
  };

  const handlePayEMI = (loanId, installmentId) => {
    navigate(`/payment/${loanId}/${installmentId}`);
  };

  const handleNavigateToAdmin = () => {
    navigate("/admin-dashboard");
  };

  const handleApplyForLoan = () => {
    navigate("/apply-loan");
  };

  const paginatedEMIs = (loanId) => {
    const allEMIs = emiSchedules[loanId] || [];
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return allEMIs.slice(startIndex, endIndex);
  };

  const totalPages = (loanId) => {
    const allEMIs = emiSchedules[loanId] || [];
    return Math.ceil(allEMIs.length / itemsPerPage);
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    try {
      const d = date.toDate ? date.toDate() : new Date(date);
      return d.toLocaleDateString("en-IN");
    } catch {
      return "Invalid Date";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-violet-800 flex items-center justify-center p-4">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="bg-white/5 backdrop-blur-2xl rounded-2xl shadow-2xl overflow-hidden w-full max-w-6xl border border-white/10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          {/* Left Column - User Profile */}
          <div className="p-10 bg-gradient-to-br from-indigo-900/50 to-purple-900/50 flex flex-col items-center relative overflow-hidden">
            {/* Floating particles */}
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute rounded-full bg-white/10"
                  style={{
                    width: `${Math.random() * 10 + 5}px`,
                    height: `${Math.random() * 10 + 5}px`,
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    animation: `float ${
                      Math.random() * 10 + 10
                    }s linear infinite`,
                    animationDelay: `${Math.random() * 5}s`,
                  }}
                />
              ))}
            </div>

            {/* User avatar with glowing effect */}
            <div className="relative mb-8 group">
              <div className="w-40 h-40 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-6xl font-bold text-white shadow-xl z-10 relative overflow-hidden">
                {user.displayName
                  ? user.displayName.charAt(0).toUpperCase()
                  : user.email.charAt(0).toUpperCase()}
                <div className="absolute inset-0 rounded-full bg-white/20 group-hover:opacity-0 transition-opacity duration-300" />
              </div>
              <div className="absolute inset-0 rounded-full bg-cyan-400 blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300 -z-10" />
            </div>

            <h1 className="text-4xl font-bold text-center mb-3 text-white tracking-tight">
              {user.displayName || "User"}
            </h1>

            <div className="text-center space-y-2 mb-8">
              <p className="text-white/80">
                <span className="font-medium text-white">Email:</span>{" "}
                {user.email}
              </p>
              <p className="text-white/80">
                <span className="font-medium text-white">Role:</span>{" "}
                <span
                  className={`font-semibold ${
                    isAdmin ? "text-cyan-300" : "text-yellow-300"
                  }`}
                >
                  {isAdmin ? "Admin" : "User"}
                </span>
              </p>
            </div>

            <div className="flex flex-col space-y-4 w-full max-w-xs">
              <button
                onClick={handleLogout}
                className="relative overflow-hidden px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 rounded-xl text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
              >
                <span className="relative z-10">Logout</span>
                <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-pink-700 opacity-0 hover:opacity-100 transition-opacity duration-300" />
              </button>
              <button
                onClick={handleResetPassword}
                className="relative overflow-hidden px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
              >
                <span className="relative z-10">Reset Password</span>
                <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-orange-600 opacity-0 hover:opacity-100 transition-opacity duration-300" />
              </button>
            </div>
          </div>

          {/* Right Column - Loans & EMI */}
          <div className="p-10 bg-white/5 backdrop-blur-lg flex flex-col">
            <h2 className="text-3xl font-bold text-white mb-6 pb-4 border-b border-white/10">
              {isAdmin ? "Admin Dashboard" : "Your Loan Dashboard"}
            </h2>

            {!isAdmin && approvedLoans.length > 0 ? (
              approvedLoans.map((loan) => {
                const loanEMIs = emiSchedules[loan.id] || [];
                const totalPagesForLoan = Math.ceil(
                  loanEMIs.length / itemsPerPage
                );

                return (
                  <div key={loan.id} className="mb-8">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-white">
                          Loan Type:{loan.loanType},
                          <br/>
                           Loan Amount: ₹{loan.loanAmount}
                        </h3>
                        <p className="text-sm text-white/70">
                        •  Approved on: {formatDate(loan.approvedDate)}
                        </p>
                        <p className="text-sm text-white/70">
                         • Duration:{" "}
                          {loan.emi.duration} months
                        </p>
                      </div>
                      <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm">
                        Active
                      </span>
                    </div>

                    {loanEMIs.length > 0 ? (
                      <>
                        <div className="space-y-3">
                          {paginatedEMIs(loan.id).map((instalment) => (
                            <div
                              key={instalment.id}
                              className={`p-4 rounded-xl backdrop-blur-sm transition-all duration-300 hover:scale-[1.01] ${
                                instalment.status === "pending"
                                  ? "bg-gradient-to-r from-blue-600/30 to-indigo-600/30 border border-blue-500/30 hover:border-blue-400/50"
                                  : instalment.status === "paid"
                                  ? "bg-green-900/20 border border-green-500/30"
                                  : "bg-white/5 border border-white/5"
                              }`}
                            >
                              <div className="flex justify-between items-center">
                                <div>
                                  <p className="font-medium text-white">
                                    EMI{" "}
                                    {instalment.installmentNo ||
                                      instalment.installmentNumber}
                                  </p>
                                  <p className="text-sm text-white/70">
                                    Due: {formatDate(instalment.dueDate)}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="font-bold text-white">
                                    ₹{instalment.amount.toFixed(2)}
                                    {instalment.lateFee > 0 && (
                                      <span className="text-red-400 text-sm">
                                        {" "}
                                        (+₹
                                        {parseFloat(instalment.lateFee).toFixed(
                                          2
                                        )}
                                        )
                                      </span>
                                    )}
                                  </p>
                                  <p
                                    className={`text-sm ${
                                      instalment.status === "paid"
                                        ? "text-green-400"
                                        : instalment.status === "overdue"
                                        ? "text-red-400"
                                        : "text-yellow-400"
                                    }`}
                                  >
                                    {instalment.status?.toUpperCase()}
                                  </p>
                                </div>
                              </div>
                              {instalment.status !== "paid" && (
                                <button
                                  onClick={() =>
                                    handlePayEMI(loan.id, instalment.id)
                                  }
                                  className="mt-3 w-full py-2 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg text-white font-medium hover:shadow-lg transition-all"
                                >
                                  Pay Now
                                </button>
                              )}
                            </div>
                          ))}
                        </div>

                        {/* Pagination */}
                        {totalPagesForLoan > 1 && (
                          <div className="flex justify-center gap-2 mt-6">
                            <button
                              onClick={() =>
                                setCurrentPage((prev) => Math.max(prev - 1, 1))
                              }
                              disabled={currentPage === 1}
                              className="px-4 py-2 bg-white/10 rounded-lg text-white disabled:opacity-50 hover:bg-white/20 transition"
                            >
                              Previous
                            </button>
                            <span className="px-4 py-2 text-white">
                              Page {currentPage} of {totalPagesForLoan}
                            </span>
                            <button
                              onClick={() =>
                                setCurrentPage((prev) =>
                                  Math.min(prev + 1, totalPagesForLoan)
                                )
                              }
                              disabled={currentPage === totalPagesForLoan}
                              className="px-4 py-2 bg-white/10 rounded-lg text-white disabled:opacity-50 hover:bg-white/20 transition"
                            >
                              Next
                            </button>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-center py-4 text-white/60">
                        No EMI schedule found for this loan
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-24 h-24 mb-4 bg-white/10 rounded-full flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 text-white/50"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-white mb-2">
                  {isAdmin ? "Admin Dashboard Access" : "No Active Loans"}
                </h3>
                <p className="text-white/60 max-w-md">
                  {isAdmin
                    ? "You're logged in as an administrator. Access the admin dashboard to manage loan applications."
                    : "You don't have any active loans yet. Apply for a new loan to see your EMI schedule here."}
                </p>
                {isAdmin ? (
                  <button
                    onClick={handleNavigateToAdmin}
                    className="mt-6 px-6 py-3 bg-gradient-to-r from-purple-500 to-fuchsia-600 rounded-xl text-white font-medium hover:shadow-lg transition-all"
                  >
                    Go to Admin Dashboard
                  </button>
                ) : (
                  <button
                    onClick={handleApplyForLoan}
                    className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl text-white font-medium hover:shadow-lg transition-all"
                  >
                    Apply for Loan
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <style jsx global>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0) translateX(0);
          }
          25% {
            transform: translateY(-20px) translateX(10px);
          }
          50% {
            transform: translateY(0) translateX(20px);
          }
          75% {
            transform: translateY(20px) translateX(10px);
          }
        }
      `}</style>
    </div>
  );
};

export default Profile;
