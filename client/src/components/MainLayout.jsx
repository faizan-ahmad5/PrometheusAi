import Sidebar from "./Sidebar";
import ChatBox from "./ChatBox";

const MainLayout = () => {
  return (
    <div className="flex h-screen w-screen bg-white dark:bg-[#18181b]">
      {/* Sidebar */}
      <div className="hidden md:block w-80 h-full border-r border-gray-200 dark:border-gray-800 bg-gradient-to-b from-[#1a2238] to-[#283655]">
        <Sidebar />
      </div>
      {/* Mobile Sidebar (optional, can be toggled) */}
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full">
        <ChatBox />
      </div>
    </div>
  );
};

export default MainLayout;