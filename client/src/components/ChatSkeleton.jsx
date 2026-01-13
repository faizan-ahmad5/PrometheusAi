const Shimmer = () => (
  <div className="animate-pulse bg-gray-200 dark:bg-gray-800" />
);

const ChatSkeleton = () => {
  return (
    <div className="h-screen w-screen flex bg-white dark:bg-black text-gray-900 dark:text-white">
      {/* Sidebar placeholder */}
      <div className="hidden md:flex flex-col w-72 p-5 border-r border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-[#0b0b0f]/70 backdrop-blur">
        <div className="h-10 w-32 rounded-md bg-gray-200 dark:bg-gray-800" style={{ animation: 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite' }} />
        <div className="mt-8 space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-10 rounded-md bg-gray-200 dark:bg-gray-800" style={{ animation: 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite' }} />
          ))}
        </div>
      </div>

      {/* Chat pane */}
      <div className="flex-1 flex flex-col p-4 sm:p-6 lg:p-10 gap-4">
        <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
          <div className="h-6 w-40 rounded-md bg-gray-200 dark:bg-gray-800" style={{ animation: 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite' }} />
          <span className="text-xs px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
            Signing you in...
          </span>
        </div>
        <div className="flex-1 space-y-4 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex gap-3">
              <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-800" style={{ animation: 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite' }} />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-3/4 rounded-md bg-gray-200 dark:bg-gray-800" style={{ animation: 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite' }} />
                <div className="h-4 w-1/2 rounded-md bg-gray-200 dark:bg-gray-800" style={{ animation: 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite' }} />
              </div>
            </div>
          ))}
        </div>
        <div className="h-14 rounded-full border border-dashed border-gray-300 dark:border-gray-700 flex items-center px-4">
          <div className="h-4 w-20 rounded bg-gray-200 dark:bg-gray-800" style={{ animation: 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite' }} />
        </div>
      </div>
    </div>
  );
};

export default ChatSkeleton;