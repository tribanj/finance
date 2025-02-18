import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import { Timestamp } from "firebase/firestore";

const formatDate = (timestamp) => {
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate().toLocaleDateString();
  }
  return "Unknown Date";
};

const UserLoanApplications = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const db = getFirestore();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLoans = async () => {
      setLoading(true);
      try {
        console.log("Fetching loan applications for userId:", userId);

        // Firestore Query
        const q = query(collection(db, "applications"), where("userId", "==", userId));
        const querySnapshot = await getDocs(q);
        const loans = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        console.log("Fetched loan applications:", loans);
        setApplications(loans);
      } catch (error) {
        console.error("Error fetching loan applications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLoans();
  }, [userId, db]);

  const handleApprove = (loanId) => {
    navigate(`/loan-approval/${loanId}`); // Redirect to loan approval page
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">
        Loan Applications for User ID: {userId}
      </h1>

      {loading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : applications.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <p className="text-gray-600 text-lg">No loan applications found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {applications.map((loan) => (
            <div key={loan.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  Loan Application ID: {loan.id}
                </h2>
                <div className="space-y-3 text-gray-700">
                  <p><strong>Applicant Name:</strong> {loan.fullName}</p>
                  <p><strong>Aadhar No:</strong> {loan.aadharNumber}</p>
                  <p><strong>PAN No:</strong> {loan.panNumber}</p>
                  <p><strong>Account No:</strong> {loan.accountNumber}</p>
                  <p><strong>Mobile No:</strong> {loan.contact}</p>
                  <p><strong>Date of Birth:</strong> {loan.dob}</p>
                  <p><strong>IFSC:</strong> {loan.ifsc}</p>
                  <p><strong>Bank Name:</strong> {loan.bankName}</p>
                  <p><strong>Address:</strong> {loan.address}</p>
                  <p><strong>Occupation:</strong> {loan.occupation}</p>
                  <p><strong>Employer Name:</strong> {loan.employer}</p>
                  <p><strong>Employment Type:</strong> {loan.employmentType}</p>
                  <p><strong>Purpose of Loan:</strong> {loan.loanPurpose}</p>
                  <p><strong>Gender:</strong> {loan.gender}</p>
                  <p><strong>Loan Type:</strong> {loan.loanType}</p>
                  <p><strong>Income:</strong> ₹{loan.income}</p>
                  <p><strong>Loan Amount:</strong> ₹{loan.loanAmount}</p>
                  <p><strong>Repayment Tenure:</strong> {loan.tenure} months</p>
                  <p>
                    <strong>Status:</strong>{" "}
                    <span
                      className={`font-bold ${
                        loan.status === "approved"
                          ? "text-green-600"
                          : loan.status === "pending"
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      {loan.status}
                    </span>
                  </p>
                  <p><strong>Applied Date:</strong> {formatDate(loan.createdAt)}</p>
                </div>
              </div>
              <div className="p-4 bg-gray-50 border-t border-gray-200">
                <button
                  onClick={() => handleApprove(loan.id)}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Approve Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserLoanApplications;