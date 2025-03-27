import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, collection, addDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "../firebaseConfig";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import qrCodeUrl from '../../assets/payments-QR.jpeg'
const PaymentsPage = () => {
  const { loanId, installmentId } = useParams();
  const navigate = useNavigate();
  const [loanDetails, setLoanDetails] = useState(null);
  const [installmentDetails, setInstallmentDetails] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [utrNumber, setUtrNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  // const [qrCodeUrl, setQrCodeUrl] = useState(""); // Add your QR code image URL here

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Get loan details
        const loanRef = doc(db, "loans", loanId);
        const loanSnap = await getDoc(loanRef);

        if (loanSnap.exists()) {
          const loanData = {
            id: loanSnap.id,
            ...loanSnap.data(),
            approvedAt:
              loanSnap.data().approvedAt?.toDate?.() ||
              loanSnap.data().approvedAt,
          };
          setLoanDetails(loanData);

          // 2. Get user details
          const userRef = doc(db, "users", loanSnap.data().userId);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            setUserDetails({
              id: userSnap.id,
              ...userSnap.data(),
            });
          }

          // 3. Get installment details
          const installmentRef = doc(
            db,
            "emi",
            loanId,
            "installments",
            installmentId
          );
          const installmentSnap = await getDoc(installmentRef);

          if (installmentSnap.exists()) {
            const installmentData = installmentSnap.data();
            setInstallmentDetails({
              id: installmentSnap.id,
              ...installmentData,
              amount:
                typeof installmentData.amount === "number"
                  ? installmentData.amount
                  : parseFloat(installmentData.amount || 0),
              dueDate:
                installmentData.dueDate?.toDate?.() || installmentData.dueDate,
              status: installmentData.status || "pending",
            });
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load payment details");
      }
    };

    fetchData();
  }, [loanId, installmentId]);

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (!utrNumber.trim()) {
      toast.error("Please enter UTR/Transaction ID");
      return;
    }

    if (!/^[a-zA-Z0-9]{12,}$/.test(utrNumber)) {
      toast.error("Please enter a valid 12+ character UTR/Transaction ID");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Record the payment in payments collection
      const paymentsRef = collection(db, "payments");
      const paymentDoc = await addDoc(paymentsRef, {
        loanId,
        installmentId,
        userId: userDetails?.id,
        userName: userDetails?.displayName || userDetails?.email,
        userEmail: userDetails?.email,
        loanType: loanDetails?.loanType,
        amount: installmentDetails?.amount || 0,
        utrNumber,
        status: "pending_verification",
        paymentDate: new Date(),
        processedBy: null,
        processedAt: null,
        paymentMethod: "UPI",
      });

      // 2. Update the installment status to 'pending_verification'
      const installmentRef = doc(
        db,
        "emi",
        loanId,
        "installments",
        installmentId
      );
      await updateDoc(installmentRef, {
        status: "pending_verification",
        paymentSubmittedAt: new Date(),
        paymentId: paymentDoc.id,
        utrNumber: utrNumber,
        lastUpdated: new Date(),
      });

      toast.success(
        "Payment submitted for verification! Status will update after admin approval."
      );
      navigate("/profile");
    } catch (error) {
      console.error("Error submitting payment:", error);
      toast.error("Failed to submit payment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!loanDetails || !installmentDetails || !userDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  // Format amount safely
  const formattedAmount = installmentDetails.amount.toFixed(2);

  // Format date safely
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-violet-800 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <ToastContainer position="top-right" autoClose={5000} />
      <div className="max-w-4xl mx-auto w-full">
        <div className="bg-white/10 rounded-2xl shadow-2xl overflow-hidden border border-white/20 transform transition-all hover:scale-[1.02] duration-300 relative">
          {/* Floating Particles */}
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
                  animation: `float ${Math.random() * 10 + 10}s linear infinite`,
                  animationDelay: `${Math.random() * 5}s`,
                }}
              />
            ))}
          </div>
  
          <div className="p-8 md:p-10 relative z-10">
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-white bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent animate-pulse">
                Payment Portal
              </h2>
              <p className="mt-2 text-sm md:text-base text-gray-200">
                Complete your payment with ease and style
              </p>
            </div>
  
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Payment Summary Section */}
              <div className="space-y-6 bg-white/5 p-6 rounded-xl border border-white/10 shadow-lg">
                <h3 className="text-lg font-semibold text-white bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent border-b border-white/20 pb-2">
                  Loan Information
                </h3>
  
                <div className="space-y-4 text-white">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-300">Loan Type:</span>
                    <span className="text-sm font-semibold capitalize">{loanDetails.loanType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-300">Loan Amount:</span>
                    <span className="text-sm font-semibold">₹{loanDetails.loanAmount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-300">Approved On:</span>
                    <span className="text-sm font-semibold">{formatDate(loanDetails.approvedAt)}</span>
                  </div>
                </div>
  
                <h3 className="text-lg font-semibold text-white bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent border-b border-white/20 pb-2 mt-6">
                  Installment Details
                </h3>
  
                <div className="space-y-4 text-white">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-300">Installment No.:</span>
                    <span className="text-sm font-semibold">
                      {installmentDetails.installmentNo || installmentDetails.installmentNumber || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-300">Due Date:</span>
                    <span className="text-sm font-semibold">{formatDate(installmentDetails.dueDate)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-white/20">
                    <span className="text-base font-medium">Amount Due:</span>
                    <span className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                      ₹{formattedAmount}
                    </span>
                  </div>
                </div>
  
                <div className="mt-6 p-4 bg-white/10 rounded-lg border border-white/20 shadow-md">
                  <h4 className="text-sm font-medium text-cyan-300 mb-2">Payment Instructions:</h4>
                  <ul className="text-xs text-gray-300 space-y-1 list-disc list-inside">
                    <li>Scan the QR code or use UPI ID to pay ₹{formattedAmount}</li>
                    <li>Save the payment receipt after transaction</li>
                    <li>Enter the correct UTR/Transaction ID below</li>
                    <li>Status will show as "Pending Verification" after submission</li>
                  </ul>
                </div>
              </div>
  
              {/* Payment Form Section */}
              <div>
                <div className="mb-6 p-4 bg-white/10 rounded-xl border border-white/20 shadow-lg text-center transform transition-all hover:scale-105 duration-300">
                  <h4 className="text-sm font-medium text-white mb-2">Pay Using UPI</h4>
                  <div className="flex justify-center mb-3">
                    {qrCodeUrl ? (
                      <div className="w-52 h-52 bg-white/20 p-2 rounded-lg overflow-hidden relative group">
                        <img
                          src={qrCodeUrl}
                          alt="UPI QR Code"
                          className="w-full h-full object-cover rounded"
                        />
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                    ) : (
                      <div className="w-52 h-52 bg-white/20 flex items-center justify-center rounded-lg">
                        <span className="text-gray-400">QR Code Placeholder</span>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-300 mt-2">Scan with any UPI app to pay ₹{formattedAmount}</p>
                  <div className="mt-3 p-2 bg-white/20 rounded border border-white/30">
                    <p className="text-xs font-medium text-gray-300">UPI ID:</p>
                    <p className="text-sm font-mono text-white">ravikants63@fifederal</p>
                  </div>
                  <div className="mt-3 p-2 bg-white/20 rounded border border-white/30">
                    <p className="text-xs font-medium text-gray-300">Account details:</p>
                    <p className="text-sm font-mono text-white"> Account number: 55550129597363</p>
                    <p className="text-sm font-mono text-white">  IFSC: FDRL0005555 </p>
                    <p className="text-sm font-mono text-white">  Beneficiary: Ravikant Sharma</p>
                  </div>
                </div>
  
                <form onSubmit={handlePaymentSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="utrNumber" className="block text-sm font-medium text-gray-200 mb-1">
                      UTR/Transaction ID
                    </label>
                    <input
                      type="text"
                      id="utrNumber"
                      value={utrNumber}
                      onChange={(e) => setUtrNumber(e.target.value)}
                      className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent shadow-md transition-all duration-300"
                      placeholder="Enter 12+ digit UTR/Transaction ID"
                      required
                      pattern="[A-Za-z0-9]{12,}"
                      title="Please enter a valid 12+ character UTR/Transaction ID"
                    />
                    <p className="mt-1 text-xs text-gray-400">
                      Find this in your bank/payment app transaction details
                    </p>
                  </div>
  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg text-white font-medium shadow-lg hover:shadow-xl hover:from-cyan-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 relative overflow-hidden"
                  >
                    <span className="relative z-10">
                      {isSubmitting ? (
                        <div className="flex items-center justify-center">
                          <svg
                            className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Submitting...
                        </div>
                      ) : (
                        "Submit Payment Details"
                      )}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-700 opacity-0 hover:opacity-100 transition-opacity duration-300" />
                  </button>
                </form>
  
                <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10 shadow-md">
                  <h4 className="text-sm font-medium text-yellow-300 mb-2">Verification Process</h4>
                  <ul className="text-xs text-gray-300 space-y-1 list-disc list-inside">
                    <li>Your payment will be "Pending Verification" after submission</li>
                    <li>Admin will verify within 24-48 working hours</li>
                    <li>You'll receive email notification when verified</li>
                    <li>Status will change to "Paid" after successful verification</li>
                    <li>Contact support@example.com for any queries</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      {/* Animation Styles */}
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

export default PaymentsPage;
