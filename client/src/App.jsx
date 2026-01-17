import { useState } from "react";
import { Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { useAppContext } from "./context/AppContext";
import { assets } from "./assets/assets";

import Sidebar from "./components/Sidebar";
import AuthModal from "./components/AuthModal";
import ForgotPasswordModal from "./components/ForgotPasswordModal";

import Landing from "./pages/Landing";
import About from "./pages/About";
import Contact from "./pages/Contact";
import ResetPassword from "./pages/ResetPassword";
import Verify from "./pages/Verify";
import ChatBox from "./components/ChatBox";
import Credits from "./pages/Credits";
import Community from "./pages/Community";
import NotFound from "./pages/NotFound";
import Buy from "./pages/Buy";

import "./assets/prism.css";
import "./assets/ux-improvements.css";

const App = () => {
  const { user, loadingUser, loggingOut } = useAppContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { pathname } = useLocation();

  // Modern animated loader with branding for initial app load

  // Layout for chat routes
  const ChatLayout = () => (
    <div className="bg-white dark:bg-gradient-to-b from-[#242124] to-[#000000] dark:text-white">
      <div className="flex h-screen w-screen">
        <Sidebar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
        <Outlet />
      </div>
    </div>
  );

  if (loadingUser) {
    return (
      <div className="fixed inset-0 z-[999] flex items-center justify-center bg-white dark:bg-[#18181b]">
        <svg className="animate-spin h-12 w-12 text-orange-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
        </svg>
      </div>
    );
  }

  return (
    <>
      <Toaster />
      <AuthModal />
      <ForgotPasswordModal />

      {loggingOut && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center backdrop-blur bg-black/30">
          <div className="flex flex-col items-center">
            <svg className="animate-spin h-12 w-12 text-orange-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
            </svg>
            <span className="text-orange-500 font-semibold text-xl">Logging you out...</span>
          </div>
        </div>
      )}

      {!isMenuOpen && (
        <img
          src={assets.menu_icon}
          className="absolute top-3 left-3 w-8 h-8 cursor-pointer md:hidden not-dark:invert"
          alt="menu"
          onClick={() => setIsMenuOpen(true)}
        />
      )}

      <Routes>
        {/* Public routes */}
        <Route path="/" element={user ? <Navigate to="/chat" replace /> : <Landing />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/community" element={<Community />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/reset" element={<ResetPassword />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/buy" element={<Buy />} />

        {/* Protected chat routes */}
        <Route
          path="/chat/*"
          element={user ? <ChatLayout /> : <Navigate to="/" replace />}
        >
          <Route index element={<ChatBox />} />
          <Route path="credits" element={<Credits />} />
          <Route path="*" element={<Navigate to="/chat" replace />} />
        </Route>

        {/* Catch-all 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;