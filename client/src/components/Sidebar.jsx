import React, { useState, useRef } from "react";
import { useAppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import moment from "moment";
import toast from "react-hot-toast";


const Sidebar = ({ isMenuOpen, setIsMenuOpen }) => {

  const { chats, setSelectedChat, theme, setTheme, user, navigate, createNewChat, logout, axios, token, setChats, fetchUserChats } = useAppContext();
  const [ search, setSearch ] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [renamingChatId, setRenamingChatId] = useState(null);
  const [renameValue, setRenameValue] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [showDeleteAllConfirm, setShowDeleteAllConfirm] = useState(false);

  // --- RENAME CHAT HANDLERS (must be above JSX) ---
  const startRename = (chat) => {
    setRenamingChatId(chat._id);
    setRenameValue(chat.name || (chat.messages[0]?.content.slice(0,32) ?? ""));
  };

  const cancelRename = () => {
    setRenamingChatId(null);
    setRenameValue("");
  };

  const saveRename = async (chatId) => {
    if (!renameValue.trim()) return toast.error("Chat name cannot be empty");
    try {
      const { data } = await axios.post("/api/chat/rename", { chatId, name: renameValue }, { headers: { Authorization: token } });
      if (data.success) {
        await fetchUserChats();
        // Set the selected chat to the renamed one (by id)
        setSelectedChat(prev => prev && prev._id === chatId ? { ...prev, name: renameValue } : prev);
        toast.success("Chat renamed");
        setRenamingChatId(null);
        setRenameValue("");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  const profileRef = useRef();

  // Close dropdown on outside click
  React.useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);



  const deleteChat = async (chatId) => {
    try {
      const { data } = await axios.post(
        "/api/chat/delete",
        { chatId },
        { headers: { Authorization: token } }
      );
      
      if (data.success) {
        setChats(prev => prev.filter(chat => chat._id !== chatId));
        await fetchUserChats();
        toast.success("Chat deleted successfully");
        setDeleteConfirmId(null);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const deleteAllChats = async () => {
    try {
      const { data } = await axios.post(
        "/api/chat/delete-all",
        {},
        { headers: { Authorization: token } }
      );
      
      if (data.success) {
        setChats([]);
        setSelectedChat(null);
        await fetchUserChats();
        toast.success("All chats deleted successfully");
        setShowDeleteAllConfirm(false);
        setProfileOpen(false);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };


  return (
    <div className={`flex flex-col h-screen min-w-72 max-w-48 w-full p-3 dark:bg-gradient-to-b from-[#242124]/30 to-[#000000]/30 border-r border-[#80609F]/30 backdrop-blur-3xl transition-all duration-500 max-md:absolute left-0 z-10 ${!isMenuOpen && "max-md:-translate-x-full"}`}> 
      {/* App Name and Tagline */}
      <div className="mb-1 select-none">
        <h1 className="text-3xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-[#FC752B] to-[#F7931E] dark:from-[#FC752B] dark:to-[#F7931E]">PrometheusAi</h1>
        <p className="text-xs mt-1 text-gray-400 dark:text-[#B1A6C0] font-light">Your AI-powered assistant</p>
      </div>

      {/* New Chat Button */}
      <button onClick={createNewChat} className="flex justify-center items-center w-full py-1.5 mt-3 text-white bg-gradient-to-r from-[#FC752B] to-[#F7931E] text-sm rounded-md cursor-pointer">
        <span className="mr-2 text-xl">+</span> New Chat
      </button>

      {/* Search Conversations */}
      <div className="flex items-center gap-2 p-2 mt-3 border border-gray-400 dark:border-white/20 rounded-md">
        <img src={assets.search_icon} className="w-4 brightness-0 dark:brightness-100" alt="search" />
        <input onChange={(e) => setSearch(e.target.value)} value={search} type="text" placeholder="Search conversations" className="text-xs placeholder:text-gray-400 outline-none" />
      </div>

      {/* Recent Chats */}
      {chats.length > 0 && <p className="mt-3 text-sm text-gray-900 dark:text-gray-100">Recent Chats</p>}

      <div className="mt-2 flex-1 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto pr-1">
          <div className="text-sm space-y-1.5">
            {chats.filter((chat) => chat.messages[0] ? chat.messages[0]?.content.toLowerCase().includes(search.toLowerCase()) : chat.name.toLowerCase().includes(search.toLowerCase())).map((chat) => (
            <div key={chat._id} className="p-1.5 px-3 bg-gray-100 dark:bg-[#57317C]/10 border border-gray-300 dark:border-[#80609F]/15 rounded-md flex justify-between items-center group mb-1.5 hover:bg-gray-200 dark:hover:bg-[#57317C]/20 cursor-pointer transition-colors">
              <div className="flex-1 min-w-0" onClick={() => {if (renamingChatId !== chat._id) {navigate("/"); setSelectedChat(chat); setIsMenuOpen(false)}}}>
                {renamingChatId === chat._id ? (
                  <input
                    type="text"
                    value={renameValue}
                    onChange={e => setRenameValue(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') saveRename(chat._id); if (e.key === 'Escape') cancelRename(); }}
                    autoFocus
                    className="w-full px-2 py-1 rounded bg-gray-100 dark:bg-[#242428] text-gray-900 dark:text-white border border-orange-400 dark:border-orange-500 outline-none text-xs font-medium"
                  />
                ) : (
                  <>
                    <p className="truncate w-full text-gray-900 dark:text-gray-100">
                      {chat.name || (chat.messages.length > 0 ? chat.messages[0].content.slice(0,32) : "")}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-[#B1A6C0]">
                      {moment(chat.updatedAt).fromNow()}
                    </p>
                  </>
                )}
              </div>
              <div className="flex items-center gap-2 ml-2">
                {renamingChatId === chat._id ? (
                  <>
                    <button onClick={() => saveRename(chat._id)} className="text-green-500 hover:text-green-400 text-xs font-bold px-1.5">✓</button>
                    <button onClick={cancelRename} className="text-gray-400 hover:text-gray-300 text-xs font-bold px-1.5">✕</button>
                  </>
                ) : (
                  <svg onClick={() => startRename(chat)} xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-400 hover:text-orange-400 cursor-pointer flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M17.414 2.586a2 2 0 00-2.828 0l-8.586 8.586A2 2 0 005 13v2a1 1 0 001 1h2a2 2 0 001.414-.586l8.586-8.586a2 2 0 000-2.828zM6 15v-2l8.586-8.586a1 1 0 011.414 1.414L7.414 14H6z" />
                  </svg>
                )}
                <img 
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteConfirmId(chat._id);
                  }} 
                  src={assets.bin_icon} 
                  className="w-4 cursor-pointer brightness-0 dark:brightness-100" 
                  alt="bin" 
                />
              </div>
            </div>
          ))}
          </div>
        </div>
      </div>

      {/* Profile Section */}
      <div ref={profileRef} className="relative mt-auto flex flex-col">
        <div
          className="flex items-center gap-2 p-2 border border-gray-300 dark:border-white/15 rounded-md cursor-pointer group bg-black/20 hover:bg-black/30 transition-all"
          onClick={() => setProfileOpen((v) => !v)}
        >
          <img src={assets.user_icon} className="w-7 rounded-full brightness-0 dark:brightness-100 dark:drop-shadow-[0_0_8px_rgba(252,117,43,0.6)]" alt="user" style={{filter: 'invert(1) sepia(1) saturate(1.5) hue-rotate(346deg)'}} />
          <div className="flex-1">
            <p className="text-sm text-gray-900 dark:text-primary truncate font-semibold">{user ? user.name : "Login your account"}</p>
            {/* Email hidden by default, only in dropdown */}
          </div>
          <svg className={`w-4 h-4 transition-transform text-gray-600 dark:text-gray-400 ${profileOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
        </div>
        {profileOpen && (
          <div className="absolute right-0 min-w-full w-full min-h-[220px] bg-white dark:bg-[#18181b] border border-gray-300 dark:border-[#80609F]/30 rounded-lg shadow-lg z-50 p-3 space-y-2 animate-dropdown-tight transition-all duration-200 bottom-full mb-2">
            {user && (
              <>
                <p className="text-xs text-gray-500 dark:text-[#B1A6C0] truncate mb-1">{user.email}</p>
                <div className="flex items-center gap-2">
                  <img src={assets.diamond_icon} className="w-5 brightness-0 dark:invert" alt="diamond" />
                  <span className="text-sm text-gray-900 dark:text-white">Credits: <span className="font-bold">{user.credits}</span></span>
                </div>
                <button 
                  onClick={() => {
                    setProfileOpen(false);
                    navigate("/buy");
                  }} 
                  className="w-full text-left text-xs text-orange-700 dark:text-orange-400 hover:underline font-medium"
                >
                  Purchase Credits
                </button>
                <button 
                  onClick={() => {
                    setProfileOpen(false);
                    setShowDeleteAllConfirm(true);
                  }} 
                  className="w-full text-left text-xs text-orange-700 dark:text-orange-400 hover:underline mt-2 font-medium"
                >
                  Delete All Chats
                </button>
                <div className="flex items-center justify-between pt-2 border-t border-[#80609F]/20">
                  <span className="text-sm flex items-center gap-2 text-gray-900 dark:text-white"><img src={assets.theme_icon} className="w-4 brightness-0 dark:brightness-100" alt="theme" />Dark Mode</span>
                  <label className="relative inline-flex cursor-pointer">
                    <input onChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')} type="checkbox" className="sr-only peer" checked={theme === 'dark'} readOnly />
                    <div className="w-9 h-5 bg-gray-400 rounded-full peer-checked:bg-orange-600 transition-all"></div>
                    <span className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform peer-checked:translate-x-4"></span>
                  </label>
                </div>
                <button onClick={() => setShowLogoutConfirm(true)} className="w-full mt-2 py-2 bg-gradient-to-r from-[#FC752B] to-[#F7931E] text-white rounded-md font-semibold hover:opacity-90 transition-all">Logout</button>
              </>
            )}
            {!user && (
              <button onClick={() => {navigate('/'); setIsMenuOpen(false); setProfileOpen(false);}} className="w-full py-2 bg-gradient-to-r from-[#FC752B] to-[#F7931E] text-white rounded-md font-semibold hover:opacity-90 transition-all">Login</button>
            )}
          </div>
        )}
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-[#18181b] p-6 rounded-xl shadow-2xl border border-[#80609F]/30 flex flex-col items-center min-w-[300px]">
            <span className="text-lg font-semibold text-white mb-2">Are you sure you want to logout?</span>
            <div className="flex gap-4 mt-4">
              <button onClick={() => setShowLogoutConfirm(false)} className="px-4 py-2 rounded bg-gray-600 text-white hover:bg-gray-700 transition">Cancel</button>
              <button onClick={() => { setShowLogoutConfirm(false); logout(); }} className="px-4 py-2 rounded bg-gradient-to-r from-[#FC752B] to-[#F7931E] text-white font-semibold hover:opacity-90 transition">Logout</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete All Chats Confirmation Modal */}
      {showDeleteAllConfirm && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-[#18181b] p-6 rounded-xl shadow-2xl border border-[#80609F]/30 flex flex-col items-center min-w-[300px]">
            <span className="text-lg font-semibold text-white mb-2">Delete All Chats</span>
            <p className="text-gray-400 text-sm text-center mb-4">Are you sure? This action cannot be undone.</p>
            <div className="flex gap-4 mt-4 w-full">
              <button onClick={() => setShowDeleteAllConfirm(false)} className="flex-1 px-4 py-2 rounded bg-gray-600 text-white hover:bg-gray-700 transition">Cancel</button>
              <button onClick={deleteAllChats} className="flex-1 px-4 py-2 rounded bg-gradient-to-r from-[#FC752B] to-[#F7931E] text-white hover:opacity-90 transition font-medium">Delete</button>
            </div>
          </div>
        </div>
      )}

      <img onClick={() => setIsMenuOpen(false)} src={assets.close_icon} className="absolute top-3 right-3 w-5 h-5 cursor-pointer md:hidden brightness-0 dark:brightness-100" alt="close" />

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-[#18181b] p-8 rounded-xl shadow-2xl border border-[#80609F]/30 flex flex-col items-center min-w-[320px]">
            <h3 className="text-lg font-semibold text-white mb-2">Delete Chat</h3>
            <p className="text-gray-400 text-sm text-center mb-6">Are you sure you want to delete this chat? This action cannot be undone.</p>
            <div className="flex gap-3 w-full">
              <button 
                onClick={() => setDeleteConfirmId(null)} 
                className="flex-1 px-4 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition-colors font-medium"
              >
                Cancel
              </button>
              <button 
                onClick={() => deleteChat(deleteConfirmId)} 
                className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-[#FC752B] to-[#F7931E] text-white hover:opacity-90 transition-colors font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Sidebar;