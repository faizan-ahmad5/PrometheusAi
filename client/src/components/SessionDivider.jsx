import React from "react";
import moment from "moment";

const SessionDivider = ({ timestamp }) => {
  return (
    <div className="flex items-center gap-3 my-4 sm:my-6 px-2 sm:px-4">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent"></div>
      <span className="text-xs text-gray-500 dark:text-gray-400 font-medium whitespace-nowrap">
        {timestamp ? moment(timestamp).format('MMM D, h:mm A') : 'New Chat'}
      </span>
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent"></div>
    </div>
  );
};

export default SessionDivider;