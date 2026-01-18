import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";

const ForgotPasswordModal = ({ isOpen, onClose, onSwitchToLogin }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Email is required");
      return;
    }
    setLoading(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/user/forgot-password`,
        { email: email.trim().toLowerCase() }
      );
      setSubmitted(true);
      toast.success("If an account with this email exists, we’ve sent a password reset link.");
    } catch (error) {
      // Always show generic success for security
      setSubmitted(true);
      toast.success("If an account with this email exists, we’ve sent a password reset link.");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setEmail("");
    setSubmitted(false);
    onSwitchToLogin();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      {/* Loader Overlay */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-16 h-16 border-4 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      <div className="bg-white dark:bg-[#2a2a2a] rounded-lg p-8 w-full max-w-md relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          ✕
        </button>

        {!submitted ? (
          <>
            <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
              Forgot Password?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
              Enter the email address you used to sign up. We’ll send a password reset link if an account exists.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#3a3a3a] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                disabled={loading}
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 bg-gradient-to-r from-orange-500 to-orange-400 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>

              <button
                type="button"
                onClick={handleBack}
                className="w-full py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition"
              >
                Back to Login
              </button>
            </form>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
              Check Your Email
            </h2>
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
              <p className="text-blue-900 dark:text-blue-200 text-sm">
                We've sent a password reset link to <strong>{email}</strong>. Check your inbox and click the link to reset your password. The link expires in 1 hour.
              </p>
            </div>

            <button
              onClick={handleBack}
              className="w-full py-2 bg-gradient-to-r from-orange-500 to-orange-400 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-orange-500 transition"
            >
              Back to Login
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordModal;