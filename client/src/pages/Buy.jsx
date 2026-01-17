import React, { useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import axios from "axios";
import toast from "react-hot-toast";

const Buy = () => {
  const { user, navigate, token, fetchUserData } = useAppContext();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [purchaseLoading, setPurchaseLoading] = useState(false);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const { data } = await axios.get("/api/credit/plans");
      if (data.success) {
        setPlans(data.plans);
      }
      setLoading(false);
    } catch (error) {
      toast.error("Failed to load plans");
      setLoading(false);
    }
  };

  const handlePurchase = async (planId) => {
    if (!user) {
      toast.error("Please login to purchase credits");
      navigate("/");
      return;
    }

    setPurchaseLoading(true);
    try {
      const { data } = await axios.post(
        "/api/credit/purchase",
        { planId },
        { headers: { Authorization: token } }
      );

      if (data.success) {
        // Redirect to payment gateway in new tab
        window.open(data.url, '_blank');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setPurchaseLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-gradient-to-b from-[#242124] to-[#000000]">
        <svg className="animate-spin h-12 w-12 text-orange-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
        </svg>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gradient-to-b from-[#242124] to-[#000000] text-gray-900 dark:text-white py-4 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <button
            onClick={() => navigate(-1)}
            className="mb-6 flex items-center gap-2 text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 sm:mb-3 bg-gradient-to-r from-[#FC752B] to-[#F7931E] bg-clip-text text-transparent">
            Choose Your Plan
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-400">Select the perfect plan for your needs</p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {plans.map((plan, index) => (
            <div
              key={plan._id}
              className={`relative rounded-xl sm:rounded-2xl p-6 sm:p-8 border-2 transition-all duration-300 hover:scale-105 ${
                index === 1
                  ? "border-orange-500 bg-gradient-to-b from-orange-50 dark:from-orange-900/20 to-transparent dark:to-transparent"
                  : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50"
              }`}
            >
              {index === 1 && (
                <div className="absolute -top-3 sm:-top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-[#FC752B] to-[#F7931E] text-white px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm font-semibold">
                  Most Popular
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-xl sm:text-2xl font-bold mb-2 text-gray-900 dark:text-white">{plan.name}</h3>
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">${plan.price}</span>
                  <span className="text-xs sm:text-base text-gray-600 dark:text-gray-400">/ one-time</span>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <img src={assets.diamond_icon} className="w-5 h-5 sm:w-6 sm:h-6 dark:invert" alt="credits" />
                  <span className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">{plan.credits} Credits</span>
                </div>
              </div>

              <ul className="space-y-2 sm:space-y-3 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handlePurchase(plan._id)}
                disabled={purchaseLoading}
                className={`w-full py-2 sm:py-3 rounded-lg font-semibold transition-all duration-300 text-sm sm:text-base ${
                  index === 1
                    ? "bg-gradient-to-r from-[#FC752B] to-[#F7931E] text-white hover:opacity-90 disabled:opacity-70"
                    : "bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-400 dark:hover:bg-gray-600 disabled:opacity-70"
                }`}
              >
                {purchaseLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  "Get Started"
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Footer Note */}
        <div className="text-center mt-12 text-gray-600 dark:text-gray-400 text-sm">
          <p>All plans are one-time purchases. Credits never expire.</p>
        </div>
      </div>
    </div>
  );
};

export default Buy;