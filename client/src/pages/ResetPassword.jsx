import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAppContext } from "../context/useAppContext";
import toast from "react-hot-toast";
import axios from "axios";
// Removed logo to keep the reset page minimal

const ResetPassword = () => {
  const navigate = useNavigate();
  const { openAuthModal } = useAppContext();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");
  const [tokenError, setTokenError] = useState("");
  const [resending, setResending] = useState(false);
    // const [tokenValid, setTokenValid] = useState(!!token);

  useEffect(() => {
    if (!token) {
      setTokenError("Invalid or missing reset token.");
    }
  }, [token]);

  // Password strength checker
  useEffect(() => {
    if (!password) {
      setPasswordStrength("");
      return;
    }
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    if (score <= 2) setPasswordStrength("Weak");
    else if (score === 3 || score === 4) setPasswordStrength("Medium");
    else setPasswordStrength("Strong");
  }, [password]);

  const handleResend = async () => {
    setResending(true);
    try {
      await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/user/forgot-password`, { email: "" });
      toast.success("If that email is registered, a reset link has been sent.");
      setTokenError("");
      navigate("/", { replace: true });
    } catch (err) {
      toast.error("Failed to resend reset link. Try again later.");
    } finally {
      setResending(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password || !confirmPassword) {
      toast.error("Please fill in all fields.");
      return;
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }
    if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password) || !/[^A-Za-z0-9]/.test(password)) {
      toast.error("Password must include uppercase, lowercase, number, and symbol.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/user/reset-password`,
        {
          token,
          password,
        }
      );
      if (response.data.success) {
        setSuccess(true);
        setPassword("");
        setConfirmPassword("");
        setTimeout(() => {
          setRedirecting(true);
          setTimeout(() => {
            navigate("/", { replace: true });
            openAuthModal();
          }, 2200);
        }, 1200);
      }
    } catch (error) {
      const message = error.response?.data?.message || "Failed to reset password. Please try again.";
      if (message.toLowerCase().includes("token")) {
        setTokenError("Your reset link is invalid or expired.");
      }
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen dark:bg-gradient-to-b from-[#242124] to-[#000000] dark:text-white flex items-center justify-center p-4 relative">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-[#2a2a2a] rounded-lg p-8 shadow-lg">
          <h1 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
            Reset Password
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
            Enter your new password below. It must be at least 8 characters and include uppercase, lowercase, number, and symbol.
          </p>

          {tokenError ? (
            <div className="bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6 text-center">
              <p className="text-red-900 dark:text-red-200 text-sm mb-2">{tokenError}</p>
              <button
                onClick={handleResend}
                disabled={resending}
                className="w-full py-2 bg-gradient-to-r from-orange-500 to-orange-400 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {resending ? "Resending..." : "Resend Reset Link"}
              </button>
            </div>
          ) : success ? (
            <div className="flex flex-col items-center justify-center gap-4 py-8">
              <div className="flex flex-col items-center gap-2">
                <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" /><path d="M8 12l2.5 2.5L16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                <p className="text-lg font-semibold text-green-700 dark:text-green-300">Password updated successfully!</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">You can now log in with your new password.</p>
              </div>
              {redirecting ? (
                <div className="flex flex-col items-center gap-2 mt-4">
                  <div className="w-8 h-8 border-4 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm text-gray-500 dark:text-gray-300">Redirecting you to login…</span>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => { openAuthModal(); navigate("/", { replace: true }); }}
                    className="w-full py-2 bg-gradient-to-r from-orange-500 to-orange-400 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-orange-500 transition mt-4"
                  >
                    Go to Login
                  </button>
                  <button
                    onClick={handleBack}
                    className="w-full py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition text-sm"
                  >
                    Back to Home
                  </button>
                </>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Password Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#3a3a3a] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                {password && (
                  <div className={`mt-1 text-xs font-semibold ${passwordStrength === "Weak" ? "text-red-500" : passwordStrength === "Medium" ? "text-yellow-500" : "text-green-500"}`}>
                    Password strength: {passwordStrength}
                  </div>
                )}
              </div>

              {/* Confirm Password Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#3a3a3a] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 bg-gradient-to-r from-orange-500 to-orange-400 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition mt-6 flex items-center justify-center gap-2"
              >
                {loading && (
                  <span className="inline-block w-5 h-5 border-2 border-orange-400 border-t-transparent rounded-full animate-spin mr-2"></span>
                )}
                {loading ? "Updating password…" : "Reset Password"}
              </button>

              {/* Back Button */}
              <button
                type="button"
                onClick={handleBack}
                className="w-full py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition"
                disabled={loading}
              >
                Back to Home
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;