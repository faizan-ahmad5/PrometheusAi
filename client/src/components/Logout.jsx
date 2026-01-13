import { useAppContext } from "../context/AppContext";
import { useState } from "react";

const Logout = () => {
  const { setUser, setToken, navigate } = useAppContext();
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    setLoading(true);
    setTimeout(() => {
      setUser(null);
      setToken(null);
      localStorage.removeItem("token");
      navigate("/", { replace: true });
      window.toast && window.toast.success("Logged out successfully!");
      setLoading(false);
    }, 1000);
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-500 text-white px-4 py-2 rounded font-bold mt-4"
      disabled={loading}
    >
      {loading ? "Logging out..." : "Logout"}
    </button>
  );
};

export default Logout;