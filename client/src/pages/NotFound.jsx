import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f7f9fc] to-[#f0f4f8] dark:from-[#0c101a] dark:to-[#0f1628] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-9xl font-bold bg-gradient-to-r from-[#FF6B35] to-[#F7931E] bg-clip-text text-transparent mb-4">
          404
        </div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
          Page Not Found
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg mb-8">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-3 rounded-lg bg-gradient-to-r from-[#FF6B35] to-[#F7931E] text-white font-semibold hover:shadow-lg transition-all duration-300"
        >
          Go Back Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;