import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import { Timestamp } from "firebase/firestore";

const formatDate = (timestamp) => {
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate().toLocaleDateString();
  }
  return timestamp ? new Date(timestamp).toLocaleDateString() : "Unknown Date";
};

const UserLoanApplications = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const db = getFirestore();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLoans = async () => {
      setLoading(true);
      setError(null);

      try {
        console.log("Fetching loan applications for userId:", userId);

        const q = query(collection(db, "applications"), where("userId", "==", userId));
        const querySnapshot = await getDocs(q);

        const loans = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // console.log("Fetched loan applications:", loans);
        setApplications(loans);
      } catch (error) {
        console.error("Error fetching loan applications:", error);
        setError("Failed to fetch loan applications.");
      } finally {
        setLoading(false);
      }
    };

    fetchLoans();
  }, [userId, db]);

  const handleApprove = (loanId) => {
    navigate(`/loan-approval/${loanId}`); 
  };

  return (
    <div className="p-4 sm:p-8 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 min-h-screen">
      <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-500 mb-8">
        Loan Applications <span className="text-gray-400">for User ID:</span> {userId}
      </h1>

      {loading ? (
        <div className="flex justify-center items-center min-h-[300px]">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-dashed border-cyan-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-600/20 p-6 rounded-lg text-red-400 border border-red-500 text-center">
          {error}
        </div>
      ) : applications.length === 0 ? (
        <div className="bg-gray-800/50 backdrop-blur-lg p-8 rounded-3xl shadow-2xl text-center border border-gray-700">
          <p className="text-2xl font-light text-gray-400">No loan applications found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {applications.map((loan) => (
            <div
              key={loan.id}
              className="group bg-gray-800/40 hover:bg-gray-800/60 backdrop-blur-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-700/30 hover:border-cyan-500/20 relative"
            >
              <div className="absolute inset-0 rounded-2xl border border-white/5 pointer-events-none"></div>

              {/* Mobile Layout */}
              <div className="lg:hidden flex flex-col">
                <div className="p-6 pb-4 flex flex-col gap-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-bold text-cyan-400">#{loan.id}</h2>
                      <p className="text-sm text-gray-400">{loan.fullName}</p>
                    </div>
                    <StatusBadge status={loan.status} />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <DetailItem label="Loan Amount" value={`₹${loan.loanAmount}`} />
                    <DetailItem label="Tenure" value={`${loan.tenure} months`} />
                    <DetailItem label="Applied Date" value={formatDate(loan.createdAt)} />
                    <DetailItem label="Loan Type" value={loan.loanType} />
                  </div>
                </div>

                <div className="p-4 bg-gray-900/20 border-t border-gray-700/30">
                  <ApproveButton loanId={loan.id} onClick={handleApprove} />
                </div>
              </div>

              {/* Desktop Layout */}
              <div className="hidden lg:block p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-cyan-400">#{loan.id}</h2>
                    <p className="text-gray-400 text-sm">{loan.fullName}</p>
                  </div>
                  <StatusBadge status={loan.status} />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <DetailItem label="Aadhar No" value={loan.aadharNumber} />
                  <DetailItem label="PAN No" value={loan.panNumber} />
                  <DetailItem label="Contact" value={loan.contact} />
                  <DetailItem label="DOB" value={loan.dob} />
                  <DetailItem label="Bank Name" value={loan.bankName} />
                  <DetailItem label="Account No" value={loan.accountNumber} />
                  <DetailItem label="IFSC" value={loan.ifsc} />
                  <DetailItem label="Income" value={`₹${loan.income}`} />
                </div>

                <div className="space-y-4">
                  <div className="bg-gray-900/30 p-4 rounded-xl border border-gray-700/20">
                    <h3 className="text-sm font-semibold text-cyan-500 mb-2">Loan Details</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <DetailItem label="Amount" value={`₹${loan.loanAmount}`} />
                      <DetailItem label="Tenure" value={`${loan.tenure} months`} />
                      <DetailItem label="Type" value={loan.loanType} />
                      <DetailItem label="Purpose" value={loan.loanPurpose} />
                    </div>
                  </div>

                  <ApproveButton loanId={loan.id} onClick={handleApprove} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const DetailItem = ({ label, value }) => (
  <div className="flex flex-col">
    <span className="text-xs font-medium text-cyan-500/80">{label}</span>
    <span className="text-gray-200 text-sm font-medium">{value}</span>
  </div>
);

const StatusBadge = ({ status }) => (
  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
    status === "approved" ? "bg-green-900/40 text-green-400" :
    status === "pending" ? "bg-yellow-900/40 text-yellow-400" :
    "bg-red-900/40 text-red-400"
  }`}>
    {status}
  </span>
);

const ApproveButton = ({ loanId, onClick }) => (
  <button
    onClick={() => onClick(loanId)}
    className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-gray-100 py-3 px-6 rounded-xl transition-all duration-300"
  >
    Approve Application
  </button>
);

export default UserLoanApplications;
