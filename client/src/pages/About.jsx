import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppContext } from "../context/useAppContext";
import { motion } from "framer-motion";

const About = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { openAuthModal } = useAppContext();
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
                    <path d="M10 3.5a1 1 0 011 1V6a1 1 0 11-2 0V4.5a1 1 0 011-1zm0 9.5a3 3 0 100-6 3 3 0 000 6zm6.5-4a1 1 0 110 2H15a1 1 0 110-2h1.5zM5 10a1 1 0 01-1 1H2.5a1 1 0 110-2H4a1 1 0 011 1z" />
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
                aria-controls="mobile-menu-about"
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
          <div id="mobile-menu-about" className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white/90 dark:bg-black/90 backdrop-blur-md fade-slide-down">
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
            <span className="px-4 py-2 rounded-full bg-orange-600/20 border border-orange-600/30 text-orange-400 text-sm font-semibold">Our Story</span>
          </motion.div>
          <motion.h1
            className="text-4xl sm:text-5xl md:text-7xl font-bold leading-tight"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25, type: "spring", stiffness: 60 }}
          >
            Bringing the Power of AI <br/>
            <motion.span
              className="text-transparent bg-gradient-to-r from-[#FF6B35] via-orange-500 to-[#F7931E] bg-clip-text"
              initial={{ opacity: 0, x: 32 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.45, type: "spring", stiffness: 60 }}
            >
              to Everyone
            </motion.span>
          </motion.h1>
          <motion.p
            className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl leading-relaxed"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7, type: "spring", stiffness: 60 }}
          >
            Founded on the principle that advanced artificial intelligence should not be reserved for the privileged few. PrometheusAi democratizes AI technology, making it accessible, affordable, and easy to use for everyone.
          </motion.p>
        </div>
      </section>

      {/* Origin Section */}
      <section className="max-w-7xl mx-auto px-6 py-24 border-t border-gray-200 dark:border-gray-800">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">The Philosophy Behind Our Name</h2>
            <div className="space-y-6 text-gray-700 dark:text-gray-300 text-base leading-relaxed">
              <p>
                Prometheus, in Greek mythology, was the Titan who defied the divine order to bring fire to humanity. This act of rebellion wasn't merely about sharing a resource—it represented a belief that transformative knowledge and power should not be monopolized by an elite few.
              </p>
              <p>
                By stealing fire from Mount Olympus, Prometheus enabled human progress, civilization, and innovation. He paid a heavy price, but his legacy remains: the idea that empowerment through technology transcends all barriers.
              </p>
              <p>
                We chose the name PrometheusAi because it embodies our core belief. Just as Prometheus brought fire to humanity, we're bringing the transformative power of artificial intelligence to individuals, businesses, and creators everywhere—breaking down the barriers that have traditionally kept advanced AI tools inaccessible.
              </p>
            </div>
          </div>
          <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-900/50 dark:to-black border border-gray-200 dark:border-orange-600/30 rounded-2xl p-12 relative overflow-hidden shadow-md">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-600/10 to-transparent"></div>
            <div className="relative">
              <div className="text-6xl mb-8 font-bold text-orange-500">P</div>
              <h3 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Prometheus</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-500 uppercase tracking-wide mb-2">Symbol</p>
                  <p className="text-gray-700 dark:text-gray-300">Knowledge, Innovation & Human Progress</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-500 uppercase tracking-wide mb-2">Legacy</p>
                  <p className="text-gray-700 dark:text-gray-300">Empowerment through transformative technology</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-500 uppercase tracking-wide mb-2">Philosophy</p>
                  <p className="text-gray-700 dark:text-gray-300">Breaking barriers to innovation and progress</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="max-w-7xl mx-auto px-6 py-24 border-t border-gray-200 dark:border-gray-800">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div className="bg-gradient-to-br from-gray-50 to-white dark:from-orange-600/10 dark:to-transparent border border-gray-200 dark:border-orange-600/30 rounded-xl p-10 shadow-sm">
            <h3 className="text-sm font-semibold text-orange-400 uppercase tracking-widest mb-4">Our Mission</h3>
            <p className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Democratizing Advanced AI</p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              To empower individuals, businesses, and creators with cutting-edge artificial intelligence tools that are accessible, affordable, and intuitive. We remove technical barriers and democratize technology that was once available only to large enterprises.
            </p>
          </div>
          <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-black border border-gray-200 dark:border-gray-800 rounded-xl p-10 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-widest mb-4">Our Vision</h3>
            <p className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">AI for All</p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              A world where artificial intelligence accelerates human potential across all industries and backgrounds. Where innovation isn't limited by cost or complexity, but available to anyone with an idea and the drive to execute it.
            </p>
          </div>
        </div>
      </section>

      {/* Recent Product Upgrades */}
      <section className="max-w-7xl mx-auto px-6 py-20 border-t border-gray-200 dark:border-gray-800">
        <div className="flex flex-col md:flex-row md:items-start gap-6 mb-12">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-orange-500">Experience Upgrades</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mt-2">Features that keep you in flow</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-3 max-w-2xl">Practical improvements that make PrometheusAi smoother to use every day.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {[
            {
              icon: "01",
              title: "Image downloads",
              desc: "One-click download for generated images with proper filenames, so assets save directly to your device without opening a new tab."
            },
            {
              icon: "02",
              title: "Faster feedback",
              desc: "Skeleton loaders across chat, credit actions, and new chat creation keep the UI responsive and reduce perceived wait times."
            },
            {
              icon: "03",
              title: "Context-aware greetings",
              desc: "Professional, lighthearted greetings that stay stable within a chat, rotating only on mode switch or page reload for a polished feel."
            }
          ].map((item, idx) => (
            <motion.div
              key={item.icon}
              className="p-6 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0c101a] shadow-sm"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.15, type: "spring", stiffness: 60 }}
              viewport={{ once: true, amount: 0.2 }}
            >
              <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 font-bold">{item.icon}</div>
              <h3 className="text-lg font-semibold mt-4 text-gray-900 dark:text-white">{item.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Technology Stack */}
      <section className="max-w-7xl mx-auto px-6 py-24 border-t border-gray-200 dark:border-gray-800">
        <div className="mb-16">
          <h2 className="text-5xl font-bold text-gray-900 dark:text-white">Technology & Innovation</h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mt-4 max-w-2xl">Built on state-of-the-art AI infrastructure for reliability, performance, and quality.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-black border border-gray-200 dark:border-gray-800 p-8 rounded-xl hover:border-gray-300 dark:hover:border-gray-700 transition-all shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-600/20 to-orange-600/10 border border-orange-600/30 flex items-center justify-center flex-shrink-0">
                  <span className="text-lg">AI</span>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                    Powered by Google Gemini, our conversational AI understands context, nuance, and complex reasoning with unprecedented accuracy. Natural language interactions feel like talking to an expert.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-black border border-gray-200 dark:border-gray-800 p-8 rounded-xl hover:border-gray-300 dark:hover:border-gray-700 transition-all shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-600/20 to-orange-600/10 border border-orange-600/30 flex items-center justify-center flex-shrink-0">
                  <span className="text-lg">IMG</span>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                    State-of-the-art image generation that transforms text descriptions into stunning, professional-quality visuals. From concept to creation in seconds.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-900/50 dark:to-black border border-gray-200 dark:border-orange-600/30 rounded-xl p-10 relative overflow-hidden shadow-sm">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-600/5 to-transparent"></div>
            <div className="relative">
              <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Enterprise Infrastructure</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                  <span className="text-gray-700 dark:text-gray-300">99.9% uptime SLA</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                  <span className="text-gray-700 dark:text-gray-300">Military-grade AES-256 encryption</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                  <span className="text-gray-700 dark:text-gray-300">GDPR & CCPA compliant</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                  <span className="text-gray-700 dark:text-gray-300">Global CDN for low latency</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                  <span className="text-gray-700 dark:text-gray-300">Real-time monitoring & support</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-6 py-24 border-t border-gray-200 dark:border-gray-800">
        <motion.div
          className="bg-gradient-to-br from-gray-50 to-white dark:from-orange-600/10 dark:to-transparent border border-gray-200 dark:border-orange-600/30 rounded-2xl p-16 text-center shadow-md"
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 60 }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <h2 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">Join the AI Revolution</h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto">
            Experience the power of accessible, professional-grade AI. Start creating, innovating, and transforming your work today.
          </p>
          <button
            onClick={openAuthModal}
            className="px-10 py-4 bg-gradient-to-r from-[#FF6B35] to-[#F7931E] hover:from-[#E85A24] hover:to-[#E6820D] rounded-lg font-semibold text-lg shadow-lg hover:shadow-orange-600/50 transform hover:scale-105 transition-all"
          >
            Get Started Free
          </button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 bg-gray-100/50 dark:bg-black/50 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center text-gray-600 dark:text-gray-500 text-sm">
            <p>&copy; 2025 PrometheusAi. All rights reserved. Democratizing AI for everyone.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default About;