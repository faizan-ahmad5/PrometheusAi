import React, { useEffect, useState } from "react";
import { assets } from "../assets/assets";
import moment from "moment";
import Markdown from "react-markdown";
import Prism from "prismjs";
import toast from "react-hot-toast";
import { useAppContext } from "../context/AppContext";

const Message = ({ message, chatId, onImageDeleted }) => {
  const [copied, setCopied] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showShareConfirm, setShowShareConfirm] = useState(false);
  const { axios, token, user } = useAppContext();

  useEffect(() => {
    Prism.highlightAll();
  }, [message.content]);

  const downloadImage = async (imageUrl) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `PrometheusAi-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("Image downloaded successfully");
    } catch (error) {
      toast.error("Failed to download image");
      console.error("Download error:", error);
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy");
      console.error("Copy error:", error);
    }
  };

  const shareToCommuntiy = async () => {
    try {
      setIsSharing(true);
      const { data } = await axios.post(
        "/api/message/publish",
        { chatId, imageUrl: message.content },
        { headers: { Authorization: token } }
      );

      if (data.success) {
        toast.success("Image shared to community!");
        message.isPublished = true;
        setShowShareConfirm(false);
      } else {
        toast.error(data.message || "Failed to share image");
      }
    } catch (error) {
      toast.error(error.message || "Failed to share image");
    } finally {
      setIsSharing(false);
    }
  };

  const deleteImage = async () => {
    try {
      setIsDeleting(true);
      const { data } = await axios.post(
        "/api/message/delete",
        { chatId, imageUrl: message.content },
        { headers: { Authorization: token } }
      );

      if (data.success) {
        toast.success("Image deleted successfully");
        onImageDeleted && onImageDeleted();
      } else {
        toast.error(data.message || "Failed to delete image");
      }
    } catch (error) {
      toast.error(error.message || "Failed to delete image");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="w-full overflow-x-hidden">
      {message.role === "user" ? (
        <div className="flex justify-end my-2 sm:my-3 pr-2">
          <div
            className="rounded-2xl sm:rounded-3xl p-2 sm:p-3 px-3 sm:px-5 max-w-[70vw] sm:max-w-xs shadow-sm break-words bg-[#F4F4F4] dark:bg-[#303030] text-gray-900 dark:text-white"
            style={{ overflowWrap: "break-word", wordBreak: "break-word" }}
          >
            <p className="text-xs sm:text-sm leading-relaxed break-words whitespace-normal text-gray-900 dark:text-gray-100">
              {message.content}
            </p>
            <span className="text-xs opacity-75 block text-right mt-1 sm:mt-2">
              {moment(message.timestamp).fromNow()}
            </span>
          </div>
        </div>
      ) : (
        <div className="flex my-2 sm:my-3 w-full overflow-x-hidden pl-2">
          <div className="w-full max-w-4xl overflow-x-hidden">
            {message.isImage ? (
              <div className="space-y-3">
                <div className="relative inline-block group">
                  <img
                    src={`${message.content}${message.content.includes('?') ? '&' : '?'}nocache=${Date.now()}`}
                    alt="generated"
                    className="w-full rounded-lg mb-2 max-w-sm"
                  />

                  {/* Bottom overlay with action buttons */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-b-lg p-3 flex gap-2 justify-center">
                    <button
                      onClick={() => downloadImage(message.content)}
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium bg-white/20 hover:bg-white/30 text-white transition-colors"
                      title="Download image"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v4a2 2 0 002 2h12a2 2 0 002-2v-4m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download
                    </button>
                    <button
                      onClick={() => setShowShareConfirm(true)}
                      disabled={isSharing || message.isPublished}
                      className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                        message.isPublished
                          ? "bg-green-500/50 text-white cursor-default"
                          : "bg-blue-500/80 hover:bg-blue-600 text-white disabled:opacity-50"
                      }`}
                      title={message.isPublished ? "Already shared" : "Share to community"}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      {message.isPublished ? "Shared" : "Share"}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="group">
                <div
                  className="text-xs sm:text-sm text-gray-900 dark:text-gray-100 leading-relaxed break-words reset-tw overflow-x-hidden"
                  style={{ overflowWrap: "break-word", wordBreak: "break-word" }}
                >
                  <Markdown>{message.content}</Markdown>
                </div>
                <button
                  onClick={() => copyToClipboard(message.content)}
                  className="mt-2 opacity-60 hover:opacity-100 transition-all duration-300 p-1.5 rounded hover:bg-blue-50 dark:hover:bg-gray-700"
                  title={copied ? "Copied!" : "Copy response"}
                >
                  {copied ? (
                    <svg
                      className="w-4 h-4 text-green-600 dark:text-green-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-4 h-4 text-gray-500 dark:text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Share to Community Confirmation Modal */}
      {showShareConfirm && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#18181b] p-6 rounded-xl shadow-2xl border border-gray-300 dark:border-[#80609F]/30 flex flex-col items-center min-w-[320px] max-w-[400px]">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 text-center">Share to Community?</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-2">
              This action <span className="font-semibold">cannot be undone</span>.
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-4">
              Your image will appear in the Community Gallery with your name <span className="font-semibold text-orange-500">@{user?.name || "User"}</span>
            </p>
            <div className="flex gap-3 w-full">
              <button 
                onClick={() => setShowShareConfirm(false)} 
                className="flex-1 px-4 py-2 rounded-lg bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-400 dark:hover:bg-gray-600 transition font-medium"
              >
                Cancel
              </button>
              <button 
                onClick={shareToCommuntiy}
                disabled={isSharing}
                className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-[#FC752B] to-[#F7931E] text-white hover:opacity-90 transition font-medium disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSharing ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                    </svg>
                    Sharing...
                  </>
                ) : (
                  "Confirm Share"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Message;