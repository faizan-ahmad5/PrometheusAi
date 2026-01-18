import { createContext, useContext, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";


axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL;

export const AppContext = createContext();



export const AppContextProvider = ({ children }) => {
    const [loggingOut, setLoggingOut] = useState(false);
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [chats, setChats] = useState([]);
    // Persist selectedChat only for reloads, not for full close/open or logout
    const [selectedChat, setSelectedChatState] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem("selectedChat")) || null;
        } catch {
            return null;
        }
    });
    // Track if fresh login to create new chat only once
    const freshLoginRef = useRef(false);
    const setSelectedChat = (chat) => {
        setSelectedChatState(chat);
        if (chat) {
            localStorage.setItem("selectedChat", JSON.stringify(chat));
        } else {
            localStorage.removeItem("selectedChat");
        }
    };
    const [theme, setThemeState] = useState(() => {
        const savedTheme = localStorage.getItem("theme");
        return savedTheme || "light";
    });
    
    const setTheme = (newTheme) => {
        setThemeState(newTheme);
        if(newTheme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
        localStorage.setItem("theme", newTheme);
    };

    // Apply theme on mount
    useEffect(() => {
        if(theme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [theme]);
    const [token, setToken] = useState(localStorage.getItem("token") || null);
    const [loadingUser, setLoadingUser] = useState(true);
    const isInitialAuthCheckRef = useRef(true); // Track if we're doing initial auth check
    // Auth modal state
    const [showAuthModal, setShowAuthModal] = useState(false);
    const openAuthModal = () => setShowAuthModal(true);
    const closeAuthModal = () => setShowAuthModal(false);

    // Login method - Start fresh chat session
    const login = async (email, password) => {
        try {
            const { data } = await axios.post("/api/user/login", { email, password });
            if (data.success && data.token) {
                // Keep previous chats but create a new one and select it
                // Don't clear chats or selectedChat - just mark as fresh login to create new chat
                localStorage.removeItem("chatHistory");
                // Mark as fresh login to create new chat
                freshLoginRef.current = true;
                // Set loading state to show user we're fetching their data
                setLoadingUser(true);
                // Set token to trigger user fetch
                setToken(data.token);
                localStorage.setItem("token", data.token);
                toast.success("Logged in successfully!");
                return true; // Indicate success
                // Do NOT navigate here; wait for user context to load
            } else {
                toast.error(data.message || "Login failed");
                return false; // Indicate failure
            }
        } catch (err) {
            toast.error("Invalid email or password.");
            return false; // Indicate failure
        }
    };

    // Logout method with loader - Clear all chat session data
    const logout = async () => {
        setLoggingOut(true);
        await new Promise(res => setTimeout(res, 600)); // Reduced from 1200ms for better UX
        // Clear all session data
        setUser(null);
        setToken(null);
        setChats([]);
        setSelectedChatState(null);
        // Clear all localStorage items related to chat
        localStorage.removeItem("token");
        localStorage.removeItem("selectedChat");
        localStorage.removeItem("chatHistory");
        // Reset fresh login flag
        freshLoginRef.current = false;
        setLoggingOut(false);
        toast.success("Logged out successfully!");
        navigate("/", { replace: true });
    };

    const fetchUser = async () => {
        // setUser(dummyUserData);
        try {
            const { data } = await axios.get("/api/user/data", { headers: {Authorization: token} });
            if(data.success) {
                setUser(data.user);
            } else {
                // Silently fail if not authenticated
                console.log("User fetch failed:", data.message);
                setUser(null);
            }
        } catch (error) {
            // Silently fail for auth errors, don't show toast on page load
            if (error.response?.status === 401 || error.response?.status === 403) {
                console.log("User not authenticated, clearing token");
                // Clear invalid token
                setToken(null);
                localStorage.removeItem("token");
                setUser(null);
            } else {
                // Only show error toast if NOT during initial auth check
                if (!isInitialAuthCheckRef.current) {
                    toast.error(error.message);
                } else {
                    console.error("User fetch error (during initial auth):", error.message);
                }
            }
        } finally {
            setLoadingUser(false);
            isInitialAuthCheckRef.current = false; // Mark initial check as done
        }
    }

    const createNewChat = async () => {
        try {
            if(!user) return toast("Login to create a new chat");
            await axios.get("/api/chat/create", { headers: { Authorization: token } });
            await fetchUserChats();
            navigate("/");

        } catch (error) {
            toast.error(error.message);
        }
    }

    const fetchUserChats = async () => {
        try {
            const { data } = await axios.get("/api/chat/get", { headers: { Authorization: token } });
            if(data.success) {
                setChats(data.chats);
                if(data.chats.length > 0) {
                    setSelectedChat(data.chats[0]);
                }
            } else {
                console.log("Failed to fetch chats:", data.message);
            } 
        } catch (error) {
            // Silently fail for auth errors on page load
            if (error.response?.status !== 401 && error.response?.status !== 403) {
                console.error("Chats fetch error:", error.message);
                // Only show non-auth errors
                if (error.message && error.message !== "Request failed with status code 401" && error.message !== "Request failed with status code 403") {
                    toast.error(error.message);
                }
            }
        }
    }

    const fetchUserData = async () => {
        try {
          const { data } = await axios.get("/api/user/profile", {
            headers: { Authorization: token }
          });
          if (data.success) {
            setUser(data.user);
          }
        } catch (error) {
          console.error("Failed to fetch user data:", error);
        }
      };

    useEffect(() => {
        if(user) {
            if(freshLoginRef.current) {
                // Fresh login - create new chat and start fresh session
                freshLoginRef.current = false;
                // Create a new chat for the fresh session
                axios.get("/api/chat/create", { headers: { Authorization: token } })
                    .then(() => {
                        // Fetch chats after creating new one
                        return axios.get("/api/chat/get", { headers: { Authorization: token } });
                    })
                    .then(({ data }) => {
                        if(data.success && data.chats.length > 0) {
                            setChats(data.chats);
                            // Use the wrapper setSelectedChat function to handle localStorage
                            setSelectedChat(data.chats[0]);
                        }
                    })
                    .catch((error) => {
                        toast.error("Failed to create new chat session");
                        console.error("Chat creation error:", error);
                    });
            } else {
                // Regular page reload - fetch existing chats
                fetchUserChats();
            }
        } else if(!user) {
            // User logged out - clear all session data

            setChats([]);
            setSelectedChat(null);
            localStorage.removeItem("chatHistory");
        }
    }, [user, token]);

    useEffect(() => {
        if(token) {
            setLoadingUser(true);
            fetchUser();
        } else {
            setUser(null);
            setLoadingUser(false);
        }
    }, [token]);

    // Redirect to /chat after user context is loaded and user is authenticated
    useEffect(() => {
        if (user && token && !loadingUser) {
            // Only redirect if we're on public pages (not already on /chat, /buy, etc.)
            const currentPath = window.location.pathname;
            const publicPages = ["/", "/community", "/about", "/contact", "/credits"];
            if (publicPages.includes(currentPath)) {
                navigate("/chat", { replace: true });
            }
        }
    }, [user, token, loadingUser]);


    const value = {
        navigate, user, setUser, fetchUser, chats, setChats, selectedChat, setSelectedChat, theme, setTheme,
        createNewChat, loadingUser, fetchUserChats, token, setToken, axios,
        showAuthModal, openAuthModal, closeAuthModal,
        login, logout, loggingOut,
        fetchUserData
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext(AppContext);


