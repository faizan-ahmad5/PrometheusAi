import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";


const Loading = () => {

  const navigate = useNavigate();
  const { fetchUser } = useAppContext();

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchUser();
      navigate("/");
    }, 5000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="bg-gradient-to-b dark:from-[#242124] dark:to-[#000000] from-white to-gray-50 flex items-center justify-center h-screen w-screen text-white">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-orange-400 border-t-orange-600 animate-spin"></div>
        <p className="text-gray-900 dark:text-gray-300">Loading...</p>
      </div>
    </div>
  );
};

export default Loading;