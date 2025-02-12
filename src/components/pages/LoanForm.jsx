import { useState } from "react";
import { db } from "../firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const LoanForm = ({ userId = "testUserId" }) => {
  const [amount, setAmount] = useState("");
  const [loanType, setLoanType] = useState("Personal Loan");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "loans"), {
        userId,
        amount: parseFloat(amount),
        loanType,
        status: "Pending",
        createdAt: serverTimestamp()
      });
      alert("Loan application submitted successfully!");
      setAmount("");
    } catch (error) {
      alert("Error submitting loan application: " + error.message);
    }
  };

  return (
    <div className="min-h-screen pt-20 bg-gray-900 text-white px-6">
      <div className="max-w-md mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">Apply for a Loan</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">Loan Type:</label>
            <select
              value={loanType}
              onChange={(e) => setLoanType(e.target.value)}
              className="w-full p-2 rounded bg-gray-700"
            >
              <option value="Personal Loan">Personal Loan</option>
              <option value="Home Loan">Home Loan</option>
              <option value="Car Loan">Car Loan</option>
            </select>
          </div>
          <div>
            <label className="block mb-1">Amount:</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-2 rounded bg-gray-700"
              required
            />
          </div>
          <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 py-2 rounded">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoanForm;
