import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Loading from "./Loading";
import toast from "react-hot-toast";
import axios from "axios";
import { useAppContext } from "../context/useAppContext";

const Community = () => {
  const [ images, setImages ] = useState([]);
  const [ loading, setLoading ] = useState(true);
  const [ theme, setTheme ] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });
  const [ mobileOpen, setMobileOpen ] = useState(false);
  const { openAuthModal } = useAppContext();
  const { pathname } = useLocation();

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleScrollNav = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setMobileOpen(false);
  };

  const primaryGradientClass =
    'bg-gradient-to-r from-[#FF6B35] to-[#F7931E] hover:from-[#E85A24] hover:to-[#E6820D]';

  const fetchImages = async () => {
    try {
      // Use public endpoint - no authentication required
      const { data } = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/community/images`);
      if(data.success) {
        setImages(data.images);
      } else {
        toast.error(data.message);
      }

    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false);
  }

  const handleDownload = async (imageUrl, userName) => {
    try {
      const response = await axios.get(imageUrl, {
        responseType: 'blob',
      });
      
      const blob = new Blob([response.data], { type: 'image/png' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `prometheus-${userName}-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('Image downloaded successfully!');
    } catch (error) {
      toast.error('Failed to download image');
      console.error('Download error:', error);
    }
  }

  useEffect(() => {
    fetchImages();
  }, []);

  if(loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white transition-colors">
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
              <a href="/" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition px-4 py-2 text-sm">Home</a>
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
              <a href="/" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-300">Home</a>
              <button onClick={() => { setMobileOpen(false); openAuthModal(); }} className={`w-full text-left px-3 py-2 rounded-lg ${primaryGradientClass} text-white`}>Sign In</button>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <div className="p-4 sm:p-6 pt-8 sm:pt-12 lg:px-12 2xl:px-20 w-full mx-auto overflow-y-auto bg-white dark:bg-black transition-colors">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
      <div className="mb-8 sm:mb-16 max-w-5xl">
        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
          <span className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-orange-100 to-orange-50 dark:from-orange-900/30 dark:to-orange-800/20">
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600 dark:text-orange-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </span>
          <span className="text-xs sm:text-sm font-semibold text-orange-600 dark:text-orange-400 uppercase tracking-wide">Showcase Gallery</span>
        </div>
        
        <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-3 sm:mb-4 text-gray-900 dark:text-white leading-tight">
          Community Creations
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-3xl leading-relaxed mb-4 sm:mb-6">
          Explore stunning AI-generated images created by our talented community. Each image represents a unique creative vision brought to life by advanced AI technology.
        </p>
        <div className="h-1 w-12 sm:w-16 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 rounded-full"></div>
      </div>

      {images.length > 0 ? (
        <div className="space-y-8 sm:space-y-10">
          {/* Stats Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-8 sm:mb-12 max-w-2xl">
            <div className="group relative bg-white dark:bg-gray-800/50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300 hover:border-orange-300 dark:hover:border-orange-500/50 backdrop-blur-sm">
              <div className="absolute top-0 right-0 w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-orange-100/20 to-orange-50/10 dark:from-orange-900/10 dark:to-orange-800/5 rounded-bl-2xl group-hover:from-orange-100/30 group-hover:to-orange-50/20 transition-all duration-300"></div>
              <p className="text-gray-600 dark:text-gray-400 text-xs font-medium uppercase tracking-wide">Total Creations</p>
              <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-transparent bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text mt-1.5 sm:mt-2">{images.length}</p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-0.5 sm:mt-1">AI-generated images</p>
            </div>
            
            <div className="group relative bg-white dark:bg-gray-800/50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300 hover:border-blue-300 dark:hover:border-blue-500/50 backdrop-blur-sm">
              <div className="absolute top-0 right-0 w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-100/20 to-blue-50/10 dark:from-blue-900/10 dark:to-blue-800/5 rounded-bl-2xl group-hover:from-blue-100/30 group-hover:to-blue-50/20 transition-all duration-300"></div>
              <p className="text-gray-600 dark:text-gray-400 text-xs font-medium uppercase tracking-wide">Active Creators</p>
              <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-transparent bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text mt-1.5 sm:mt-2">{new Set(images.map(img => img.userName)).size}</p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-0.5 sm:mt-1">Community members</p>
            </div>
          </div>

          {/* Gallery Grid */}
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6">Featured Gallery</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              {images.map((item, index) => (
                <div 
                  key={index}
                  className="group rounded-xl sm:rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-2xl transition-all duration-300 bg-white dark:bg-gray-800 hover:border-orange-400 dark:hover:border-orange-500 transform hover:scale-105 hover:-translate-y-1 cursor-pointer"
                >
                  <div className="relative h-40 sm:h-48 md:h-56 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
                    <img 
                      src={item.imageUrl} 
                      alt="AI Generated" 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out cursor-pointer" 
                    />
                    {/* Overlay with actions */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 sm:p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <a 
                          href={item.imageUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 text-white py-2 px-3 rounded-lg text-xs sm:text-sm font-medium transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          View
                        </a>
                        <button
                          onClick={() => handleDownload(item.imageUrl, item.userName)}
                          className="flex items-center justify-center gap-2 bg-orange-500/80 hover:bg-orange-600 text-white py-2 px-3 rounded-lg text-xs sm:text-sm font-medium transition-colors"
                          title="Download image"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Image Info */}
                  <div className="p-3 sm:p-4">
                    <div className="flex items-center gap-2 mb-2 hover:opacity-80 transition-opacity">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-xs font-bold">
                        {item.userName.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">@{item.userName}</span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">{(item.prompt && !item.prompt.startsWith('http')) ? item.prompt : "AI-generated image"}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      {item.publishedAt ? new Date(item.publishedAt).toLocaleDateString() : "Recently shared"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 sm:py-24">
          <div className="text-center max-w-md px-4">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 mb-4 sm:mb-6">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3">No Images Yet</h3>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed mb-6 sm:mb-8">
              Be the first to create and share your AI-generated images with the community. Start creating amazing visuals today!
            </p>
            <button className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700 text-white font-medium py-2 px-4 sm:py-2 sm:px-6 text-sm sm:text-base rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create First Image
            </button>
          </div>
        </div>
      )}
        </div>
      </div>
    </div>
  );
};

export default Community;