import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAppContext } from "../context/useAppContext";
import { motion } from "framer-motion";

const Landing = () => { 
  // const navigate = useNavigate();
  const { openAuthModal } = useAppContext();
  const [hoveredFeature, setHoveredFeature] = useState(null);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  // const [email, setEmail] = useState("");
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });
  
  const [demoState, setDemoState] = useState({
    userMsg1: "",
    aiMsg1: "",
    userMsg2: "",
    aiMsg2: "",
    stage: 0
  });

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  useEffect(() => {
    const userMsg1 = "How can I use AI to automate my business workflow?";
    const aiMsg1 = "Step 1: Identify repetitive tasks in your workflow\nStep 2: Use AI to automate data entry & processing\nStep 3: Set up email alerts for important tasks";
    const userMsg2 = "Can you generate an image showing this workflow?";
    const aiMsg2 = "Perfect! Here's your automation workflow generated and ready to use.";

    let timer;
    
    if (demoState.stage === 0) {
      timer = setTimeout(() => {
        let charIndex = 0;
        const typeInterval = setInterval(() => {
          if (charIndex <= userMsg1.length) {
            setDemoState(prev => ({ ...prev, userMsg1: userMsg1.substring(0, charIndex) }));
            charIndex++;
          } else {
            clearInterval(typeInterval);
            setTimeout(() => setDemoState(prev => ({ ...prev, stage: 1 })), 500);
          }
        }, 30);
      }, 500);
    } 
    else if (demoState.stage === 1) {
      timer = setTimeout(() => {
        let charIndex = 0;
        const typeInterval = setInterval(() => {
          if (charIndex <= aiMsg1.length) {
            setDemoState(prev => ({ ...prev, aiMsg1: aiMsg1.substring(0, charIndex) }));
            charIndex++;
          } else {
            clearInterval(typeInterval);
            setTimeout(() => setDemoState(prev => ({ ...prev, stage: 2 })), 800);
          }
        }, 15);
      }, 500);
    }
    else if (demoState.stage === 2) {
      timer = setTimeout(() => {
        let charIndex = 0;
        const typeInterval = setInterval(() => {
          if (charIndex <= userMsg2.length) {
            setDemoState(prev => ({ ...prev, userMsg2: userMsg2.substring(0, charIndex) }));
            charIndex++;
          } else {
            clearInterval(typeInterval);
            setTimeout(() => setDemoState(prev => ({ ...prev, stage: 3 })), 500);
          }
        }, 30);
      }, 500);
    }
    else if (demoState.stage === 3) {
      timer = setTimeout(() => {
        let charIndex = 0;
        const typeInterval = setInterval(() => {
          if (charIndex <= aiMsg2.length) {
            setDemoState(prev => ({ ...prev, aiMsg2: aiMsg2.substring(0, charIndex) }));
            charIndex++;
          } else {
            clearInterval(typeInterval);
            setTimeout(() => setDemoState(prev => ({ ...prev, stage: 0 })), 3000);
          }
        }, 20);
      }, 500);
    }

    return () => clearTimeout(timer);
  }, [demoState.stage]);

  const features = [
    {
      icon: "AI",
      title: "Language Model",
      description: "Harness the power of Google Gemini for intelligent, context-aware discussions that understand nuance and complexity."
    },
    {
      icon: "IMG",
      title: "Generative Vision",
      description: "Create high-quality, artistic images with advanced AI models. Perfect for creative projects and visual content."
    },
    {
      icon: "NET",
      title: "Technology & Innovation",
      description: "Connect with creators worldwide. Share, explore, and get inspired by community-generated content."
    },
    {
      icon: "OPS",
      title: "Flexible Credit System",
      description: "Pay-as-you-go pricing with no subscriptions. Purchase credits once and use them whenever you need."
    }
  ];

  const stats = [
    { number: "10K+", label: "Active Users" },
    { number: "500K+", label: "Images Generated" },
    { number: "99.9%", label: "Uptime" },
    { number: "24/7", label: "Support" }
  ];

  const useCases = [
    {
      persona: "Professionals",
      use: "Generate business reports, create presentations, draft emails",
      benefit: "Save 5+ hours per week on content creation"
    },
    {
      persona: "Designers & Creators",
      use: "Brainstorm ideas, generate concept art, iterate quickly",
      benefit: "10x faster creative iteration cycles"
    },
    {
      persona: "Students & Researchers",
      use: "Explain concepts, generate study materials, research assistance",
      benefit: "Personalized learning at your own pace"
    },
    {
      persona: "Entrepreneurs",
      use: "Build content, create marketing materials, develop strategies",
      benefit: "Launch faster with AI-powered insights"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Product Designer",
      content: "PrometheusAi has completely transformed my design workflow. The image generation is incredibly fast and the quality is outstanding.",
      avatar: "SC",
      rating: 5
    },
    {
      name: "Marcus Johnson",
      role: "Content Creator",
      content: "The AI conversations are so natural and helpful. I've replaced multiple tools with PrometheusAi and saved 40% on my software costs.",
      avatar: "MJ",
      rating: 5
    },
    {
      name: "Elena Rodriguez",
      role: "Business Analyst",
      content: "Incredible platform. The support team is responsive and the feature updates are frequent. Highly recommend to anyone serious about AI.",
      avatar: "ER",
      rating: 5
    },
    {
      name: "David Kim",
      role: "Software Engineer",
      content: "The best AI platform I've used. The response times are incredibly fast and the quality of outputs consistently exceeds expectations. A must-have tool for any developer.",
      avatar: "DK",
      rating: 5
    }
  ];

  const faqs = [
    {
      question: "How does PrometheusAi differ from other AI platforms?",
      answer: "PrometheusAi combines cutting-edge AI conversation models with professional image generation capabilities in one unified platform. Our unique credit system offers flexibility without long-term commitments, and our community features foster collaboration and creativity."
    },
    {
      question: "What are the pricing models for credits?",
      answer: "We offer transparent, tiered credit packages starting at $5 for Starter (100 credits), $12 for Pro (500 credits), and $18 for Premium (1000 credits). Each credit represents a certain number of AI operations. Unused credits never expire and can be used anytime."
    },
    {
      question: "Is my data encrypted and secure?",
      answer: "Absolutely. We employ military-grade AES-256 encryption for all data in transit and at rest. Your conversations are private, secure, and never used for training purposes. We comply with GDPR, CCPA, and other privacy regulations."
    },
    {
      question: "Can businesses use PrometheusAi for commercial purposes?",
      answer: "Yes. We offer business plans with commercial licenses, API access, and priority support. Contact our enterprise team for custom solutions tailored to your organization's needs."
    },
    {
      question: "What models power PrometheusAi?",
      answer: "We use Google Gemini for conversations and advanced generative models for image creation. Our AI stack is continuously updated with the latest breakthroughs in artificial intelligence."
    }
  ];

  const primaryGradientClass =
    theme === 'light'
      ? 'bg-gradient-to-r from-[#FF6B35] to-[#F7931E] hover:from-[#E85A24] hover:to-[#E6820D]'
      : 'bg-gradient-to-r from-[#FF6B35] to-[#F7931E] hover:from-[#E85A24] hover:to-[#E6820D]';
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const handleScrollNav = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setMobileOpen(false);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white overflow-hidden transition-colors">
      {/* Animated background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-600/10 dark:bg-orange-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500/10 dark:bg-orange-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800 backdrop-blur-md bg-white/80 dark:bg-black/80 transition-colors">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#FF6B35] to-[#F7931E] flex items-center justify-center font-bold text-lg">
              P
            </div>
            <span className="text-2xl font-bold text-transparent bg-gradient-to-r from-[#FF6B35] to-[#F7931E] bg-clip-text">
              PrometheusAi
            </span>
          </div>
          <div className="flex items-center gap-3">
            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-4">
              <a href="#features" onClick={(e) => { e.preventDefault(); handleScrollNav('features'); }} className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition px-4 py-2 text-sm">Features</a>
              <a href="#pricing" onClick={(e) => { e.preventDefault(); handleScrollNav('pricing'); }} className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition px-4 py-2 text-sm">Pricing</a>
              <a href="/community" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition px-4 py-2 text-sm font-medium">Community Gallery</a>
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 hover:border-orange-600/50 transition text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
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
            {/* Mobile: theme toggle + hamburger */}
            <div className="flex md:hidden items-center gap-2">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 hover:border-orange-600/50 transition text-gray-700 dark:text-gray-300"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>
              <button
                onClick={() => setMobileOpen((v) => !v)}
                className="p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-black/80"
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={mobileOpen}
                aria-controls="mobile-menu"
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
          <div id="mobile-menu" className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white/90 dark:bg-black/90 backdrop-blur-md fade-slide-down">
            <div className="max-w-7xl mx-auto px-6 py-4 space-y-2">
              <a href="#features" onClick={(e) => { e.preventDefault(); handleScrollNav('features'); }} className="block px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-300">Features</a>
              <a href="#pricing" onClick={(e) => { e.preventDefault(); handleScrollNav('pricing'); }} className="block px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-300">Pricing</a>
              <a href="/community" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-300 font-medium">Community Gallery</a>
              <button onClick={() => { setMobileOpen(false); openAuthModal(); }} className={`w-full text-left px-3 py-2 rounded-lg ${primaryGradientClass} text-white`}>Sign In</button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left side - Text */}
          <div className="space-y-8">
            <div>
                <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 leading-tight">
                 Your AI <span className="text-transparent bg-gradient-to-r from-[#FF6B35] via-orange-500 to-[#F7931E] bg-clip-text">Companion</span> for Everything
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-xl">
                Experience next-generation AI conversations and creative image generation. From ideation to execution, PrometheusAi is your intelligent partner in innovation.
              </p>
            </div>
            
            <div className="flex gap-4">
              <button
                onClick={openAuthModal}
                className={`px-8 py-4 ${primaryGradientClass} transition-all rounded-lg font-semibold text-lg text-white shadow-lg hover:shadow-orange-600/50 transform hover:scale-105`}
              >
                Start Free
              </button>
              <button
                className="px-8 py-4 border border-gray-300 dark:border-gray-600 hover:border-orange-600/50 rounded-lg font-semibold transition-all hover:bg-gray-100 dark:hover:bg-gray-900/50"
              >
                View Demo
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-200 dark:border-gray-800">
              {stats.map((stat, idx) => (
                <div key={idx}>
                  <p className="text-3xl font-bold text-orange-500">{stat.number}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right side - Interactive Demo */}
          <div className="lg:block hidden">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-600/15 to-orange-500/5 rounded-2xl blur-2xl"></div>
              <div className="relative bg-white dark:bg-gradient-to-br dark:from-gray-900 dark:to-black rounded-2xl border border-gray-200 dark:border-gray-800 p-8 overflow-hidden shadow-xl">
                {/* Animated header */}
                <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-orange-500 animate-pulse"></div>
                    <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">LIVE DEMO</span>
                  </div>
                  <span className="text-xs text-gray-400 dark:text-gray-500">Interactive Chat</span>
                </div>

                {/* Chat messages with animation */}
                <div className="space-y-6 h-80 overflow-y-auto scrollbar-hide">
                  {/* Message 1 - User prompt (typing) */}
                  {demoState.userMsg1 && (
                    <div className="flex gap-4">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-r from-[#FF6B35] to-[#F7931E] flex-shrink-0 flex items-center justify-center text-xs font-bold">
                        U
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-600 dark:text-gray-300 text-xs mb-2 font-semibold uppercase tracking-wide">You</p>
                        <div className="bg-white border border-orange-200 dark:bg-gradient-to-r dark:from-orange-600/40 dark:to-orange-600/30 dark:border-orange-600/50 rounded-lg p-3 text-black dark:text-white text-sm leading-relaxed min-h-12 flex items-center shadow-sm">
                          {demoState.userMsg1}
                          {demoState.stage === 0 && <span className="ml-1 animate-pulse">|</span>}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Message 2 - AI Response (typing) */}
                  {demoState.aiMsg1 && (
                    <div className="flex gap-4">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-r from-gray-700 to-gray-800 flex-shrink-0 flex items-center justify-center text-xs font-bold">
                        AI
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-600 dark:text-gray-300 text-xs mb-2 font-semibold uppercase tracking-wide">PrometheusAi</p>
                        <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-3 text-gray-800 dark:text-gray-200 text-sm leading-relaxed shadow-sm">
                          <p className="whitespace-pre-wrap">
                            {demoState.aiMsg1}
                            {demoState.stage === 1 && <span className="ml-1 animate-pulse">|</span>}
                          </p>
                          {demoState.stage > 1 && (
                            <div className="flex gap-2 pt-3">
                              <span className="px-2 py-1 rounded bg-orange-50 text-orange-600 text-xs border border-orange-200 dark:bg-orange-600/20 dark:text-orange-300 dark:border-orange-600/30">Workflow</span>
                              <span className="px-2 py-1 rounded bg-orange-50 text-orange-600 text-xs border border-orange-200 dark:bg-orange-600/20 dark:text-orange-300 dark:border-orange-600/30">Automation</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Message 3 - Follow up (typing) */}
                  {demoState.userMsg2 && (
                    <div className="flex gap-4">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-r from-[#FF6B35] to-[#F7931E] flex-shrink-0 flex items-center justify-center text-xs font-bold">
                        U
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-600 dark:text-gray-300 text-xs mb-2 font-semibold uppercase tracking-wide">You</p>
                        <div className="bg-white border border-orange-200 dark:bg-gradient-to-r dark:from-orange-600/40 dark:to-orange-600/30 dark:border-orange-600/50 rounded-lg p-3 text-black dark:text-white text-sm min-h-12 flex items-center shadow-sm">
                          {demoState.userMsg2}
                          {demoState.stage === 2 && <span className="ml-1 animate-pulse">|</span>}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Message 4 - AI Response with image (typing) */}
                  {demoState.aiMsg2 && (
                    <div className="flex gap-4">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-r from-gray-700 to-gray-800 flex-shrink-0 flex items-center justify-center text-xs font-bold">
                        AI
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-600 dark:text-gray-300 text-xs mb-2 font-semibold uppercase tracking-wide">PrometheusAi</p>
                        <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-3 space-y-2 shadow-sm">
                          <p className="text-gray-800 dark:text-gray-200 text-sm">
                            {demoState.aiMsg2}
                            {demoState.stage === 3 && <span className="ml-1 animate-pulse">|</span>}
                          </p>
                          {demoState.stage === 3 || demoState.stage === 0 ? (
                            <div className="rounded-lg mt-3">
                              <img
                                src="/workflow-img.png"
                                alt="Workflow diagram"
                                className="w-full h-auto rounded-lg border border-gray-200 dark:border-gray-700/50"
                                loading="lazy"
                              />
                              <p className="text-xs text-gray-400 text-center mt-3">Workflow diagram generated</p>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Input area */}
                <div className="border-t border-gray-200 dark:border-gray-700 mt-6 pt-6">
                  <div className="flex gap-3 bg-white dark:bg-gray-900/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:border-orange-600/30 transition shadow-sm">
                    <input
                      type="text"
                      placeholder="Type your prompt here..."
                      className="flex-1 bg-transparent outline-none text-gray-800 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-500 text-sm"
                      disabled
                    />
                    <button className="text-orange-600 hover:text-orange-500 transition">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5.951-1.429 5.951 1.429a1 1 0 001.169-1.409l-7-14z" />
                      </svg>
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-3 text-center">Press Enter or click send →</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-20 border-t border-gray-200 dark:border-gray-800">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-6">Powerful Capabilities</h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Engineered for performance, designed for simplicity. Access enterprise-grade AI tools with a consumer-friendly interface.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              onMouseEnter={() => setHoveredFeature(index)}
              onMouseLeave={() => setHoveredFeature(null)}
              className={`group relative p-8 rounded-xl border transition-all duration-300 cursor-pointer
                ${hoveredFeature === index 
                  ? 'bg-gradient-to-br from-orange-600/20 to-orange-600/5 border-orange-600/50 shadow-lg shadow-orange-600/20' 
                  : 'bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'
                }`}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.15, type: "spring", stiffness: 60 }}
              viewport={{ once: true, amount: 0.2 }}
            >
              <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{feature.description}</p>
              <div className="absolute inset-0 bg-gradient-to-r from-orange-600/0 to-orange-600/0 group-hover:from-orange-600/5 group-hover:to-transparent rounded-xl pointer-events-none"></div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 border-t border-gray-200 dark:border-gray-800">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-6">Perfect For Everyone</h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Whether you're a student, professional, creator, or entrepreneur, PrometheusAi adapts to your needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {useCases.map((useCase, idx) => (
            <motion.div
              key={idx}
              className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black p-8 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-orange-600/50 transition-all group"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.15, type: "spring", stiffness: 60 }}
              viewport={{ once: true, amount: 0.2 }}
            >
              <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">{useCase.persona}</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{useCase.use}</p>
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-orange-400 font-semibold text-sm">{useCase.benefit}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 border-t border-gray-200 dark:border-gray-800">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-6">Loved by Users Worldwide</h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">Join thousands of satisfied users already using PrometheusAi</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, idx) => (
            <motion.div
              key={idx}
              className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black p-8 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-orange-600/50 transition-all"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: idx * 0.18, type: "spring", stiffness: 60 }}
              viewport={{ once: true, amount: 0.2 }}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#FF6B35] to-[#F7931E] flex items-center justify-center font-bold text-white">
                  {testimonial.avatar}
                </div>
                <div>
                  <h4 className="font-semibold">{testimonial.name}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-500">{testimonial.role}</p>
                </div>
              </div>
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} className="text-orange-500">★</span>
                ))}
              </div>
              <p className="text-gray-600 dark:text-gray-400">{testimonial.content}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="max-w-7xl mx-auto px-6 py-20 border-t border-gray-200 dark:border-gray-800">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-6 text-gray-900 dark:text-white">Simple, Transparent Pricing</h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">Pay only for what you use. No hidden fees.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Free Credits Card */}
          <motion.div
            className="relative rounded-xl border p-8 transition-all bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/5 border-green-400/50 dark:border-green-600/30 ring-1 ring-green-400/20"
            initial={{ opacity: 0, scale: 0.95, y: 40 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, type: "spring", stiffness: 60 }}
            viewport={{ once: true, amount: 0.2 }}
          >
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="px-4 py-1 bg-green-500 text-white rounded-full text-sm font-semibold">Free Offer</span>
            </div>
            <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Welcome Bonus</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Perfect for getting started</p>
            <div className="mb-6">
              <span className="text-4xl font-bold text-green-600 dark:text-green-400">Free</span>
            </div>
            <p className="text-lg text-green-600 dark:text-green-400 font-semibold mb-6">20 Credits</p>
            <button
              disabled
              className="w-full py-3 rounded-lg font-semibold transition-all mb-8 bg-green-500 text-white opacity-50 cursor-not-allowed"
            >
              Already Included
            </button>
            <ul className="space-y-3">
              {["Given to every new user", "No credit card required", "Start creating immediately"].map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Paid Plans */}
          {[
            { name: "Starter", price: "$5", credits: "100", features: ["100 text generations", "50 image generations", "Basic models", "Email support"] },
            { name: "Pro", price: "$12", credits: "500", features: ["500 text generations", "200 image generations", "Priority support", "Pro models"], popular: true },
            { name: "Premium", price: "$18", credits: "1000", features: ["1000 text generations", "500 image generations", "24/7 VIP support", "Premium models"] }
          ].map((plan, idx) => (
            <motion.div
              key={idx}
              className={`relative rounded-xl border p-8 transition-all ${
                plan.popular
                  ? "bg-gradient-to-br from-orange-600/20 to-orange-600/5 border-orange-600/50 ring-1 ring-orange-600/20 transform scale-105"
                  : "bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700"
              }`}
              initial={{ opacity: 0, scale: 0.95, y: 40 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.18, type: "spring", stiffness: 60 }}
              viewport={{ once: true, amount: 0.2 }}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="px-4 py-1 bg-gradient-to-r from-[#FF6B35] to-[#F7931E] rounded-full text-sm font-semibold">Most Popular</span>
                </div>
              )}
              <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">{plan.name}</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">Perfect for {plan.name.toLowerCase()} users</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">{plan.price}</span>
                {plan.price !== "Custom" && <span className="text-gray-400 ml-2">one-time</span>}
              </div>
              <p className="text-lg text-orange-500 font-semibold mb-6">{plan.credits} Credits</p>
              <button
                onClick={openAuthModal}
                className={`w-full py-3 rounded-lg font-semibold transition-all mb-8 ${
                  plan.popular
                    ? primaryGradientClass
                    : "border border-gray-300 dark:border-gray-600 hover:border-orange-600/50 hover:bg-gray-100 dark:hover:bg-gray-900/50 text-gray-900 dark:text-white"
                }`}
              >
                Get Started
              </button>
              <ul className="space-y-3">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                    <svg className="w-5 h-5 text-orange-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto px-6 py-20 border-t border-gray-200 dark:border-gray-800">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-6 text-gray-900 dark:text-white">Frequently Asked Questions</h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">Everything you need to know about PrometheusAi</p>
        </div>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black p-6 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-all cursor-pointer overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true, amount: 0.2 }}
              onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
            >
              <div className="w-full flex justify-between items-center font-semibold text-lg text-gray-900 dark:text-white select-none hover:opacity-80 transition-opacity cursor-pointer">
                {faq.question}
                <motion.span
                  className="text-orange-500"
                  animate={{ rotate: openFaqIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  ▼
                </motion.span>
              </div>
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={
                  openFaqIndex === index
                    ? { opacity: 1, height: "auto" }
                    : { opacity: 0, height: 0 }
                }
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <p className="text-gray-600 dark:text-gray-400 mt-4 leading-relaxed">{faq.answer}</p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-7xl mx-auto px-6 py-12 md:py-20 border-t border-gray-200 dark:border-gray-800">
        <div className="relative rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 to-orange-600/5"></div>
          <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black border border-orange-600/30 rounded-2xl p-8 sm:p-12 md:p-16 text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">Ready to Get Started?</h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto">
              Join thousands of professionals and creators using PrometheusAi for intelligent conversations and creative generation.
            </p>
            <button
              onClick={openAuthModal}
              className={`w-full sm:w-auto px-6 sm:px-8 md:px-10 py-3 sm:py-3 md:py-4 ${primaryGradientClass} rounded-lg font-semibold text-sm sm:text-base md:text-lg shadow-lg hover:shadow-orange-600/50 transition-all inline-block`}
            >
              Start Your Free Trial
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 bg-gray-100/50 dark:bg-black/50 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF6B35] to-[#F7931E] flex items-center justify-center font-bold text-white">P</div>
                <span className="text-lg font-bold text-gray-900 dark:text-white">PrometheusAi</span>
              </div>
              <p className="text-gray-600 dark:text-gray-500 text-sm">Bringing the power of AI to everyone</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-gray-900 dark:text-white">Product</h4>
              <ul className="space-y-2 text-gray-600 dark:text-gray-500 text-sm">
                <li><a href="#features" className="hover:text-orange-400 transition">Features</a></li>
                <li><a href="#pricing" className="hover:text-orange-400 transition">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-gray-900 dark:text-white">Company</h4>
              <ul className="space-y-2 text-gray-600 dark:text-gray-500 text-sm">
                <li><a href="/about" className="hover:text-orange-400 transition">About</a></li>
                <li><a href="/contact" className="hover:text-orange-400 transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-gray-900 dark:text-white">Legal & Support</h4>
              <ul className="space-y-2 text-gray-600 dark:text-gray-500 text-sm">
                <li><a href="#" className="hover:text-orange-400 transition">Privacy</a></li>
                <li><a href="#" className="hover:text-orange-400 transition">Terms</a></li>
                <li><a href="#" className="hover:text-orange-400 transition">Security</a></li>
                <li><a href="#" className="hover:text-orange-400 transition">fa3n20004@gmail.com</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-800 pt-8 text-center text-gray-600 dark:text-gray-500 text-sm">
            <p>&copy; 2025 PrometheusAi. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};



export default Landing;