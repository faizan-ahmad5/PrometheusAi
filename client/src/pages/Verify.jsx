import { useEffect, useState } from "react";
import { useAppContext } from "../context/useAppContext";
import toast from "react-hot-toast";

const Verify = () => {
  const { axios, openAuthModal, navigate } = useAppContext();
  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState("");
  const [redirecting, setRedirecting] = useState(false);
  const [email, setEmail] = useState("");
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const emailParam = params.get("email");
    if (emailParam) setEmail(emailParam);
    if (!token) {
      setStatus("error");
      setMessage("Verification token is missing.");
      return;
    }
    setStatus("verifying");
    axios.post("/api/user/verify-email", { token })
      .then(({ data }) => {
        if (data.success) {
          // Optionally: window.gtag?.('event', 'email_verified');
          setStatus("success");
          setTimeout(() => {
            setRedirecting(true);
            setTimeout(() => {
              openAuthModal();
              navigate("/", { replace: true });
            }, 2000);
          }, 1200);
        } else {
          setStatus("error");
          setMessage(data.message || "Verification failed.");
        }
      })
      .catch((error) => {
        setStatus("error");
        setMessage(error?.response?.data?.message || error.message);
      });
    // eslint-disable-next-line
  }, [axios, openAuthModal, navigate]);

  const handleResend = async () => {
    if (!email) {
      toast.error("Enter your email to resend verification");
      return;
    }
    setResending(true);
    try {
      const { data } = await axios.post("/api/user/resend-verification", { email });
      if (data.success) {
        setResent(true);
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
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
      <div className="p-6 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0b0b0f] w-full max-w-md text-center shadow-sm">
        {status === "verifying" && (
          <>
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 border-4 border-orange-400 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Verifying your email…</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Please wait a moment.</p>
            </div>
          </>
        )}
        {status === "success" && (
          <>
            <div className="flex flex-col items-center gap-2 py-4">
              <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" /><path d="M8 12l2.5 2.5L16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              <h2 className="text-xl font-semibold text-green-700 dark:text-green-300">Email verified!</h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm">You can now log in to your account.</p>
            </div>
            {redirecting ? (
              <div className="flex flex-col items-center gap-2 mt-4">
                <div className="w-6 h-6 border-4 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm text-gray-500 dark:text-gray-300">Redirecting you to login…</span>
              </div>
            ) : (
              <button
                onClick={() => { openAuthModal(); navigate("/", { replace: true }); }}
                className="w-full py-2 bg-gradient-to-r from-orange-500 to-orange-400 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-orange-500 transition mt-4"
              >
                Go to Login
              </button>
            )}
          </>
        )}
        {status === "error" && (
          <>
            <h2 className="text-xl font-semibold text-red-600">Verification failed</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{message}</p>
            <div className="mt-4">
              <input
                type="email"
                placeholder="Enter your email to resend verification"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#3a3a3a] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                disabled={resending || resent}
                autoFocus
                autoComplete="email"
              />
              <button
                onClick={handleResend}
                disabled={resending || resent || !email}
                className="w-full py-2 mt-2 bg-gradient-to-r from-orange-500 to-orange-400 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {resending ? "Resending..." : resent ? "Verification Sent!" : "Resend Verification Email"}
              </button>
              {(!email || !email.includes('@')) && (
                <p className="text-xs text-red-500 mt-1">Please enter a valid email address.</p>
              )}
            </div>
            <button
              onClick={() => { openAuthModal(); navigate("/", { replace: true }); }}
              className="w-full py-2 mt-4 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition"
            >
              Go to Login
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Verify;