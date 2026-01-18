// Loader overlay for login/register UX
  const LoaderOverlay = () => (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 rounded-2xl">
      <div className="flex flex-col items-center">
        <svg className="animate-spin h-10 w-10 text-orange-500 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
        </svg>
        <span className="text-orange-500 font-semibold text-lg">Signing you in...</span>
      </div>
    </div>
  );

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppContext } from "../context/useAppContext";
import toast from "react-hot-toast";
import ForgotPasswordModal from "./ForgotPasswordModal";



const AuthModal = () => {
  const { showAuthModal, closeAuthModal, axios, setToken, user, token, loadingUser, login } = useAppContext();
  // Focus trap
  const modalRef = useRef(null);
  useEffect(() => {
    if (showAuthModal && modalRef.current) {
      const focusable = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length) focusable[0].focus();
      const handleTab = (e) => {
        if (!showAuthModal) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.key === "Tab") {
          if (e.shiftKey) {
            if (document.activeElement === first) {
              e.preventDefault();
              last.focus();
            }
          } else {
            if (document.activeElement === last) {
              e.preventDefault();
              first.focus();
            }
          }
        }
      };
      document.addEventListener("keydown", handleTab);
      return () => document.removeEventListener("keydown", handleTab);
    }
  }, [showAuthModal]);

  // Prevent background scroll
  useEffect(() => {
    if (showAuthModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [showAuthModal]);
  const [state, setState] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState("form"); // form | verifySent
  const [infoMessage, setInfoMessage] = useState("");
  const [resending, setResending] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  // Password strength checker
  const getPasswordStrength = (pwd) => {
    if (!pwd) return { score: 0, label: "", color: "" };
    
    let score = 0;
    if (pwd.length >= 8) score++;
    if (pwd.length >= 12) score++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score++;
    if (/\d/.test(pwd)) score++;
    if (/[^a-zA-Z\d]/.test(pwd)) score++;

    if (score <= 1) return { score: 1, label: "Weak", color: "bg-red-500" };
    if (score <= 2) return { score: 2, label: "Fair", color: "bg-orange-500" };
    if (score <= 3) return { score: 3, label: "Good", color: "bg-yellow-500" };
    return { score: 4, label: "Strong", color: "bg-green-500" };
  };

  const passwordStrength = getPasswordStrength(password);

  // Close modal automatically after successful login and context load
  useEffect(() => {
    if (showAuthModal && user && token && !loadingUser) {
      closeAuthModal();
    }
  }, [showAuthModal, user, token, loadingUser, closeAuthModal]);

  useEffect(() => {
    if (!showAuthModal) {
      setState("login");
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setLoading(false);
      setResending(false);
      setViewMode("form");
      setInfoMessage("");
    }
  }, [showAuthModal]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") closeAuthModal();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [closeAuthModal]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate passwords match for registration
    if (state === "register" && password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    // Validate password strength for registration
    if (state === "register" && passwordStrength.score < 2) {
      toast.error("Password is too weak. Please use a stronger password");
      return;
    }

    setLoading(true);
    const start = Date.now();
    try {
      if (state === "login") {
        // Use the context's login method for proper chat reset
        const success = await login(email, password);
        if (!success) {
          // Login failed, hide loader so form is interactive
          setLoading(false);
        }
        // If success, keep loading=true to show "Signing you in..." loader
      } else {
        // Handle registration
        const { data } = await axios.post("/api/user/register", { name, email, password });
        const elapsed = Date.now() - start;
        const minDelay = 1000;
        if (elapsed < minDelay) await new Promise(res => setTimeout(res, minDelay - elapsed));
        if (data.success) {
          if (data.token) {
            // Registration with immediate token
            setToken(data.token);
            localStorage.setItem("token", data.token);
            toast.success("Account created");
            // Do not close modal or navigate here; let context handle redirect and modal closing
          } else {
            // Show verify-sent screen only after registration success without token
            setViewMode("verifySent");
            setInfoMessage(data.message || "We sent a verification link to your email.");
            setLoading(false);
          }
        } else {
          toast.error(data.message || "Something went wrong");
          setLoading(false);
        }
      }
    } catch (error) {
      const elapsed = Date.now() - start;
      const minDelay = state === "login" ? 0 : 1200; // login has its own toast delay
      if (elapsed < minDelay) await new Promise(res => setTimeout(res, minDelay - elapsed));
      
      if (state === "register") {
        const errMsg = error?.response?.data?.message || error.message;
        const needsVerification = error?.response?.data?.needsVerification;
        if (needsVerification) {
          // Show verify-sent screen for registration requiring verification
          setViewMode("verifySent");
          setInfoMessage(errMsg || "Email not verified. We can resend the link.");
        } else {
          toast.error(errMsg);
        }
        setLoading(false);
      }
    }
  };

  const handleResend = async () => {
    if (!email) {
      toast.error("Enter your email to resend verification");
      return;
    }
    try {
      setResending(true);
      const { data } = await axios.post("/api/user/resend-verification", { email });
      if (data.success) {
        toast.success(data.message || "Verification email sent");
      } else {
        toast.error(data.message || "Failed to resend verification");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setResending(false);
    }
  };

  return (
    <AnimatePresence>
      {showAuthModal && (
        <>
          {/* Backdrop with fade */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.85 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
            className="fixed inset-0 z-50 bg-black"
            aria-hidden="true"
          />
          {/* Modal with animation */}
          <motion.div
            key="modal"
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 12 }}
            transition={{ duration: 0.26, ease: [0.4, 0, 0.2, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4 pt-20"
            role="dialog"
            aria-modal="true"
          >
            <div 
              className="relative w-full max-w-sm rounded-2xl bg-white dark:bg-[#0b0b0f] border border-orange-600/30 shadow-2xl max-h-[70vh] overflow-y-auto"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
              onScroll={(e) => {
                e.currentTarget.style.scrollbarWidth = 'none';
              }}
            >
              <style>{`
                div::-webkit-scrollbar {
                  display: none;
                }
              `}</style>
              {loading && <LoaderOverlay />}
              <button
                onClick={closeAuthModal}
                className="absolute top-3 right-3 p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-gray-800 dark:hover:text-white"
                aria-label="Close"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="px-6 sm:px-8 pt-6 pb-4 text-center">
                <p className="text-xs font-semibold text-orange-500">Welcome</p>
                <h3 className="text-xl font-bold mt-0.5 text-gray-900 dark:text-white">
                  {state === "login" ? "Sign in to continue" : "Create your account"}
                </h3>
              </div>
              {viewMode === "form" ? (
                <form onSubmit={handleSubmit} className="px-6 sm:px-8 pb-6 space-y-3">
                  {state === "register" && (
                    <div className="text-left space-y-0.5">
                      <label className="text-xs font-medium text-gray-800 dark:text-gray-200">Name</label>
                      <input
                        onChange={(e) => setName(e.target.value)}
                        value={name}
                        placeholder="Jane Doe"
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-200 dark:focus:ring-orange-800 outline-none transition text-sm"
                        type="text"
                        required
                      />
                    </div>
                  )}
                  <div className="text-left space-y-0.5">
                    <label className="text-xs font-medium text-gray-800 dark:text-gray-200">Email</label>
                    <input
                      onChange={(e) => setEmail(e.target.value)}
                      value={email}
                      placeholder="you@example.com"
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-200 dark:focus:ring-orange-800 outline-none transition text-sm"
                      type="email"
                      required
                    />
                  </div>
                  <div className="text-left space-y-0.5">
                    <label className="text-xs font-medium text-gray-800 dark:text-gray-200">Password</label>
                    <input
                      onChange={(e) => setPassword(e.target.value)}
                      value={password}
                      placeholder="••••••••"
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-200 dark:focus:ring-orange-800 outline-none transition text-sm"
                      type="password"
                      required
                    />
                    
                    {/* Password Strength Indicator (only for registration) */}
                    {state === "register" && password && (
                      <div className="mt-2 space-y-1.5">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${passwordStrength.color} transition-all duration-300`}
                              style={{ width: `${(passwordStrength.score / 4) * 100}%` }}
                            ></div>
                          </div>
                          <span className={`text-xs font-semibold ${
                            passwordStrength.score === 1 ? 'text-red-500' :
                            passwordStrength.score === 2 ? 'text-orange-500' :
                            passwordStrength.score === 3 ? 'text-yellow-500' :
                            'text-green-500'
                          }`}>
                            {passwordStrength.label}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {password.length < 8 ? "At least 8 characters" : ""}
                          {password.length >= 8 && !/[a-z]/.test(password) || !/[A-Z]/.test(password) ? "Mix of uppercase and lowercase" : ""}
                          {password.length >= 8 && !/\d/.test(password) ? "Include numbers" : ""}
                          {password.length >= 8 && !/[^a-zA-Z\d]/.test(password) ? "Add special characters" : ""}
                          {passwordStrength.score >= 2 && "Good password"}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  {/* Confirm Password (only for registration) */}
                  {state === "register" && (
                    <div className="text-left space-y-0.5">
                      <label className="text-xs font-medium text-gray-800 dark:text-gray-200">Confirm Password</label>
                      <input
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        value={confirmPassword}
                        placeholder="••••••••"
                        className={`w-full px-3 py-2 rounded-lg border text-sm ${
                          confirmPassword && password !== confirmPassword 
                            ? 'border-red-400 dark:border-red-600' 
                            : 'border-gray-200 dark:border-gray-700'
                        } bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-200 dark:focus:ring-orange-800 outline-none transition`}
                        type="password"
                        required
                      />
                      {confirmPassword && password !== confirmPassword && (
                        <p className="text-xs text-red-500 font-medium">Passwords do not match</p>
                      )}
                      {confirmPassword && password === confirmPassword && (
                        <p className="text-xs text-green-500 font-medium">✓ Passwords match</p>
                      )}
                    </div>
                  )}
                  {state === "login" && (
                    <div className="text-right -mt-2">
                      <button
                        type="button"
                        onClick={() => setShowForgotPassword(true)}
                        className="text-xs text-orange-500 hover:text-orange-600 font-semibold"
                      >
                        Forgot password?
                      </button>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 -mt-1">
                    {state === "register" ? (
                      <span>
                        Already have an account?{' '}
                        <button type="button" onClick={() => setState("login")} className="text-orange-500 hover:text-orange-600 font-semibold">Sign in</button>
                      </span>
                    ) : (
                      <span>
                        New here?{' '}
                        <button type="button" onClick={() => setState("register")} className="text-orange-500 hover:text-orange-600 font-semibold">Create one</button>
                      </span>
                    )}
                    <button type="button" onClick={closeAuthModal} className="text-gray-500 hover:text-gray-700">Cancel</button>
                  </div>
                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: 1.02 }}
                    className={`w-full py-2 rounded-lg font-semibold text-white shadow-lg transition transform text-sm ${loading ? "opacity-70" : ""} bg-gradient-to-r from-[#FF6B35] to-[#F7931E]`}
                  >
                    {loading ? "Please wait..." : state === "register" ? "Create Account" : "Login"}
                  </motion.button>
                </form>
              ) : (
                <div className="px-6 sm:px-8 pb-8 space-y-4">
                  <div className="text-left space-y-2">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Verify your email</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{infoMessage}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">If it's not in your inbox, check the spam folder.</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={closeAuthModal}
                      className="px-4 py-2 rounded-lg border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/5"
                    >
                      Close
                    </button>
                    <button
                      type="button"
                      onClick={handleResend}
                      disabled={resending}
                      className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#FF6B35] to-[#F7931E] text-white shadow disabled:opacity-60"
                    >
                      {resending ? "Resending..." : "Resend verification"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
          <ForgotPasswordModal
            isOpen={showForgotPassword}
            onClose={() => setShowForgotPassword(false)}
            onSwitchToLogin={() => setShowForgotPassword(false)}
          />
        </>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;