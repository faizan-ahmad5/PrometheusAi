import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppContext } from "../context/useAppContext";
import { motion } from "framer-motion";

const Contact = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { openAuthModal } = useAppContext();
  // Contact form removed
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (theme === "light") {
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const toggleTheme = () => setTheme((prev) => (prev === "light" ? "dark" : "light"));
  const primaryGradientClass =
    theme === "light"
      ? "bg-gradient-to-r from-[#FF6B35] to-[#F7931E] hover:from-[#E85A24] hover:to-[#E6820D]"
      : "bg-gradient-to-r from-[#FF6B35] to-[#F7931E] hover:from-[#E85A24] hover:to-[#E6820D]";

  // Contact form removed

  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white">
      {/* Background gradient */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800 backdrop-blur-md bg-white/80 dark:bg-black/80">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")} title="Back to home">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#FF6B35] to-[#F7931E] flex items-center justify-center font-bold text-lg">
              P
            </div>
            <span className="text-2xl font-bold text-transparent bg-gradient-to-r from-[#FF6B35] to-[#F7931E] bg-clip-text">
              PrometheusAi
            </span>
          </div>
          <div className="flex items-center gap-3">
            {/* Desktop actions */}
            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:border-orange-600/50 transition"
                aria-label="Toggle theme"
              >
                {theme === "light" ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 3.5a1 1 0 011 1V6a1 1 0 11-2 0V4.5a1 1 0 011-1zm0 9.5a3 3 0 100-6 3 3 0 000 6zm6.5-4a1 1 0 110 2H15a1 1 0 110-2h1.5zM5 10a1 1 0 01-1 1H2.5a1 1 0 110-2H4a1 1 0 011 1zm8.243 5.657a1 1 0 10-1.414-1.414l-1.06 1.06a1 1 0 101.414 1.415l1.06-1.06zM8.23 5.757a1 1 0 10-1.415-1.415l-1.06 1.06A1 1 0 106.17 6.818l1.06-1.06zm6.01 0l1.06-1.06a1 1 0 10-1.414-1.415l-1.06 1.06a1 1 0 101.414 1.415zM6.17 13.828l-1.06 1.06a1 1 0 101.414 1.415l1.06-1.06a1 1 0 10-1.414-1.415z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707 8.001 8.001 0 1017.293 13.293z" />
                  </svg>
                )}
              </button>
              <button
                onClick={openAuthModal}
                className={`px-6 py-2 rounded-lg ${primaryGradientClass} text-white border border-transparent`}
              >
                Sign In
              </button>
            </div>
            {/* Mobile actions */}
            <div className="flex md:hidden items-center gap-2">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300"
                aria-label="Toggle theme"
              >
                {theme === "light" ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 3.5a1 1 0 011 1V6a1 1 0 11-2 0V4.5a1 1 0 011-1zm0 9.5a3 3 0 100-6 3 3 0 000 6z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707 8.001 8.001 0 1017.293 13.293z" />
                  </svg>
                )}
              </button>
              <button
                onClick={() => setMobileOpen((v) => !v)}
                className="p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-black/80"
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileOpen}
                aria-controls="mobile-menu-contact"
              >
                {mobileOpen ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
        {/* Mobile dropdown */}
        {mobileOpen && (
          <div id="mobile-menu-contact" className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white/90 dark:bg-black/90 backdrop-blur-md fade-slide-down">
            <div className="max-w-7xl mx-auto px-6 py-4 space-y-2">
              <button onClick={() => { setMobileOpen(false); navigate("/"); }} className="block w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-300">Home</button>
              <button onClick={() => { setMobileOpen(false); navigate("/about"); }} className="block w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-300">About</button>
              <button onClick={() => { setMobileOpen(false); navigate("/contact"); }} className="block w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-300">Contact</button>
              <button onClick={() => { setMobileOpen(false); openAuthModal(); }} className={`block w-full text-left px-3 py-2 rounded-lg ${primaryGradientClass} text-white`}>Sign In</button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        <div className="space-y-6">
          <motion.div
            className="inline-block"
            initial={{ opacity: 0, y: -24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, type: "spring", stiffness: 60 }}
          >
            <span className="px-4 py-2 rounded-full bg-orange-600/20 border border-orange-600/30 text-orange-400 text-sm font-semibold">Contact Us</span>
          </motion.div>
          <motion.h1
            className="text-4xl sm:text-5xl md:text-7xl font-bold leading-tight"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25, type: "spring", stiffness: 60 }}
          >
            We're Here <br/>
            <motion.span
              className="text-transparent bg-gradient-to-r from-[#FF6B35] via-orange-500 to-[#F7931E] bg-clip-text"
              initial={{ opacity: 0, x: 32 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.45, type: "spring", stiffness: 60 }}
            >
              to Help
            </motion.span>
          </motion.h1>
          <motion.p
            className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl leading-relaxed"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7, type: "spring", stiffness: 60 }}
          >
            Have a question or feedback? Our team is ready to assist you. Reach out through any of our channels and we'll get back to you promptly.
          </motion.p>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="max-w-7xl mx-auto px-6 py-24 border-t border-gray-200 dark:border-gray-800">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Email Support",
              primary: "support@prometheusai.com",
              secondary: "Response within 24 hours",
              icon: "MAIL"
            },
            {
              title: "Live Chat",
              primary: "Available 24/7",
              secondary: "Quick answers to common questions",
              icon: "CHAT"
            },
            {
              title: "Business Inquiries",
              primary: "business@prometheusai.com",
              secondary: "Partnerships & enterprise solutions",
              icon: "BIZ"
            }
          ].map((method, idx) => (
            <motion.div
              key={idx}
              className="group relative"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.15, type: "spring", stiffness: 60 }}
              viewport={{ once: true, amount: 0.2 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-orange-600/5 to-transparent opacity-0 group-hover:opacity-100 rounded-xl transition-all duration-300"></div>
              <div className="relative bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-black p-8 rounded-xl border border-gray-200 dark:border-gray-800 group-hover:border-gray-300 dark:group-hover:border-gray-700 transition-all h-full shadow-sm">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-600/20 to-orange-600/10 border border-orange-600/30 flex items-center justify-center text-orange-400">
                    {method.icon === "MAIL" && (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    )}
                    {method.icon === "CHAT" && (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    )}
                    {method.icon === "BIZ" && (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{method.title}</h3>
                </div>
                <p className="text-gray-900 dark:text-white font-medium mb-2">{method.primary}</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{method.secondary}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Contact Form removed as requested */}


      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-6 py-24 border-t border-gray-200 dark:border-gray-800">
        <div className="bg-gradient-to-br from-gray-50 to-white dark:from-orange-600/10 dark:to-transparent border border-gray-200 dark:border-orange-600/30 rounded-2xl p-16 text-center shadow-md">
          <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Need more help?</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">Reach our team directly and we'll respond promptly.</p>
          <div className="flex justify-center">
            <a
              href="mailto:support@prometheusai.com"
              className="px-10 py-3 bg-gradient-to-r from-[#FF6B35] to-[#F7931E] hover:from-[#E85A24] hover:to-[#E6820D] rounded-lg font-semibold shadow-lg hover:shadow-orange-600/50 transform hover:scale-105 transition-all text-center"
            >
              Email Support
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 bg-gray-100/50 dark:bg-black/50 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center text-gray-700 dark:text-gray-500 text-sm">
            <p>&copy; 2025 PrometheusAi. All rights reserved. We're here to help.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Contact;