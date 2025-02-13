import { useState } from "react";
import { auth } from "../firebaseConfig";
import { RecaptchaVerifier, signInWithPhoneNumber, updateProfile } from "firebase/auth";

const PhoneLogin = () => {
  const [userName, setUserName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle phone number submission and send OTP
  const handlePhoneNumberSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Initialize reCAPTCHA verifier
      const recaptchaVerifier = new RecaptchaVerifier(
        "recaptcha-container",
        { size: "invisible" },
        auth
      );

      // Send OTP to the provided phone number (prepend '+' if needed)
      const result = await signInWithPhoneNumber(auth, `+${phoneNumber}`, recaptchaVerifier);
      setConfirmationResult(result);
      alert("OTP sent successfully!");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP verification and update user profile with the name
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Verify OTP
      const result = await confirmationResult.confirm(otp);
      const user = result.user;
      
      // Update user profile with the provided name
      if (userName) {
        await updateProfile(user, { displayName: userName });
      }
      
      alert("Login successful!");
      console.log("User:", user);
    } catch (err) {
      setError("Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-white">
        Login with Phone Number
      </h2>

      {!confirmationResult ? (
        // Phone Number & Name Form
        <form onSubmit={handlePhoneNumberSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Name
            </label>
            <input
              type="text"
              placeholder="Enter your name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Phone Number
            </label>
            <input
              type="tel"
              placeholder="Enter your phone number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cyan-500 text-white px-4 py-2 rounded-lg hover:bg-cyan-600 transition-colors"
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        </form>
      ) : (
        // OTP Form
        <form onSubmit={handleOtpSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Enter OTP
            </label>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cyan-500 text-white px-4 py-2 rounded-lg hover:bg-cyan-600 transition-colors"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>
      )}

      {/* reCAPTCHA Container */}
      <div id="recaptcha-container"></div>

      {/* Display Error Message */}
      {error && (
        <p className="mt-4 text-sm text-red-500 text-center">{error}</p>
      )}
    </div>
  );
};

export default PhoneLogin;
