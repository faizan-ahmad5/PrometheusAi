import { useEffect, useRef, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import Message from "./Message";
import SessionDivider from "./SessionDivider";
import toast from "react-hot-toast";


const ChatBox = () => {

  const containerRef = useRef(null);
  const loadedChatId = useRef(null);
  const scrollPositionRef = useRef(0);
  const lastScrollRef = useRef(0);
  const isUserScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef(null);

  const { selectedChat, setSelectedChat, user, axios, token, setUser } = useAppContext();

  const [ messages, setMessages ] = useState([]);
  const [ loading, setLoading ] = useState(false);

  const [ prompt, setPrompt ] = useState("");
  const [ mode, setMode ] = useState("text");
  const [ isPublished, setIsPublished ] = useState(false);
  const [ greetingMessage, setGreetingMessage ] = useState("");

  const greetingMessages = [
    "What can I help with?",
    "What's on the agenda today?",
    "What are you working on?",
    "Ready when you are.",
    "What's on your mind today?",
    "How can I assist you?",
    "What would you like to explore?",
    "Tell me what you need.",
    "Let's create something amazing.",
    "What's your next big idea?",
    "How can I make your day easier?",
    "What problem can I solve for you?",
    "Ready to brainstorm?",
    "What's next on your list?",
    "Let's get started!"
  ];

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * greetingMessages.length);
    setGreetingMessage(greetingMessages[randomIndex]);
  }, []);

  const onSubmit = async (e) => {
    try {
      e.preventDefault();
      if(!user) return toast("Login to send message");
      if(!selectedChat) return toast("No chat selected. Creating a new chat...");
      setLoading(true);

      const promptCopy = prompt
      setPrompt('');
      setMessages(prev => [...prev, {role: "user", content: prompt, timestamp: Date.now(), isImage: false }]);

      const { data } = await axios.post(`/api/message/${mode}`, {chatId: selectedChat._id, prompt, isPublished}, {headers: { Authorization: token }});
      if(data.success) {
        setMessages(prev => [...prev, data.reply]);
        // Update selectedChat with new messages to keep sidebar in sync
        setSelectedChat(prev => prev ? {...prev, messages: [...(prev.messages || []), {role: "user", content: prompt, timestamp: Date.now(), isImage: false }, data.reply]} : prev);
        // decrease credits
        if(mode === "image") {
          setUser(prev => ({...prev, credits: prev.credits -2}));
        } else {
          setUser(prev => ({...prev, credits: prev.credits -1}));
        }
      } else {
        toast.error(data.message);
        setPrompt(promptCopy);
      }

    } catch (error) {
      toast.error(error.message);
    } finally {
      setPrompt('');
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only load messages when switching to a NEW chat (different chat ID)
    if(selectedChat?._id) {
      if(selectedChat._id !== loadedChatId.current) {
        setMessages([...(selectedChat.messages || [])]);
        loadedChatId.current = selectedChat._id;
      }
    }
  }, [selectedChat?._id]);

  // Preserve scroll position when mode changes
  useEffect(() => {
    const handleModeChange = () => {
      if(containerRef.current) {
        // Restore scroll position after mode change
        requestAnimationFrame(() => {
          if(containerRef.current) {
            containerRef.current.scrollTop = scrollPositionRef.current;
          }
        });
      }
    };
    
    handleModeChange();
  }, [mode]);

  // Smart auto-scroll: scroll to bottom only if user is at bottom
  useEffect(() => {
    if(!containerRef.current) return;
    
    const container = containerRef.current;
    
    // If user is not manually scrolling and chat is not at bottom, auto-scroll
    if(!isUserScrollingRef.current) {
      requestAnimationFrame(() => {
        if(containerRef.current) {
          containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
      });
    }
  }, [messages]);

  // Detect manual scrolling
  const handleScroll = (e) => {
    const container = e.target;
    const isAtBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 50;
    
    isUserScrollingRef.current = !isAtBottom;
    
    // Clear previous timeout
    if(scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    
    // Reset user scrolling flag after 2 seconds of no scroll
    scrollTimeoutRef.current = setTimeout(() => {
      isUserScrollingRef.current = false;
    }, 2000);
  };

  // Preserve scroll position when messages load
  useEffect(() => {
    if(!containerRef.current) return;
    
    // Save the scroll position before messages change
    lastScrollRef.current = containerRef.current.scrollTop;
    
    // Restore immediately and keep trying until successful
    const restoreScroll = () => {
      if(containerRef.current && lastScrollRef.current > 0) {
        containerRef.current.scrollTop = lastScrollRef.current;
      }
    };
    
    restoreScroll();
    
    // Try multiple times to ensure scroll is restored
    const timer1 = setTimeout(restoreScroll, 0);
    const timer2 = setTimeout(restoreScroll, 50);
    const timer3 = requestAnimationFrame(restoreScroll);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      cancelAnimationFrame(timer3);
    };
  }, [selectedChat?._id]);

  return (
    <div className="flex-1 flex flex-col justify-between h-full px-2 sm:px-4 md:px-10 py-3 sm:py-5 md:py-10 gap-3 sm:gap-4 overflow-x-hidden">

      {/* Chat Messages */}
      <div ref={containerRef} className="flex-1 overflow-y-auto overflow-x-hidden" onScroll={handleScroll}>
        {messages.length === 0 && !loading && (
          <div className="h-full flex flex-col items-center justify-center gap-4 text-center px-2">
            <p className="text-lg sm:text-2xl md:text-4xl text-gray-500 dark:text-gray-400 font-light px-2">{greetingMessage}</p>
          </div>
        )} 

        {messages.length > 0 && <SessionDivider timestamp={messages[0]?.timestamp} />}

        {messages.map((message, index) => <Message key={index} message={message} />)}

        {/* Typing indicator */}
        {loading && (
          <div className="flex items-center gap-2 my-2 sm:my-4">
            <div className="flex items-center gap-1 p-2 sm:p-3 px-3 sm:px-4 bg-white dark:bg-[#1a1a1e] border border-gray-200 dark:border-gray-700 rounded-3xl">
              <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-orange-500 animate-bounce" style={{ animationDelay: '0s' }}></div>
              <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-orange-500 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-orange-500 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        )}

      </div>

      {mode === "image" && (
        <label className="inline-flex items-center gap-2 text-xs sm:text-sm mx-auto">
          <p className="text-xs">Publish Generated Image to Community</p>
          <input type="checkbox" className="cursor-pointer" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} />
        </label>
      )}

      {/* Prompt Input Box */}
      <form onSubmit={onSubmit} className="bg-white dark:bg-[#1a1a1e] border border-gray-200 dark:border-gray-700 rounded-2xl w-full max-w-2xl sm:max-w-xl md:max-w-2xl p-2 sm:p-2.5 px-4 sm:px-5 mx-auto flex items-center gap-2 sm:gap-2.5 shadow-sm flex-shrink-0">
        {/* Mode Toggle */}
        <div className="flex bg-gray-100 dark:bg-[#242428] rounded-lg p-0.5">
          <button
            type="button"
            onClick={() => {
              if(containerRef.current) {
                scrollPositionRef.current = containerRef.current.scrollTop;
              }
              setMode("text");
            }}
            className={`px-3 py-1 text-xs sm:text-sm rounded transition-all font-medium flex-shrink-0 ${
              mode === "text"
                ? "bg-white dark:bg-[#1a1a1e] text-gray-900 dark:text-white shadow-sm"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300"
            }`}
          >
            Text
          </button>
          <button
            type="button"
            onClick={() => {
              if(containerRef.current) {
                scrollPositionRef.current = containerRef.current.scrollTop;
              }
              setMode("image");
            }}
            className={`px-3 py-1 text-xs sm:text-sm rounded transition-all font-medium flex-shrink-0 ${
              mode === "image"
                ? "bg-white dark:bg-[#1a1a1e] text-gray-900 dark:text-white shadow-sm"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300"
            }`}
          >
            Image
          </button>
        </div>
        <div className="w-px h-6 bg-gray-200 dark:bg-gray-700"></div>
        <input onChange={(e) => setPrompt(e.target.value)} value={prompt} type="text" placeholder="Type message..." className="flex-1 min-w-0 text-xs sm:text-sm outline-none bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400" required />
        <button disabled={loading} className="p-2 hover:bg-gray-100 dark:hover:bg-[#242428] rounded-lg transition-colors flex-shrink-0">
          <img src={loading ? assets.stop_icon : assets.send_icon} className="w-6 h-6 sm:w-7 sm:h-7 cursor-pointer" alt="send/stop" />
        </button>
      </form>

    </div>
  );
};

export default ChatBox;