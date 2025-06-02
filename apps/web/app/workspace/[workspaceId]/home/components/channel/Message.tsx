"use client";
import React, { useEffect, useRef, useState } from "react";
import UpperTemplate from "./UpperTemplate";
import MessageUI from "../MessageUI";
import { Picker } from "emoji-mart";
import "emoji-mart/css/emoji-mart.css";
import { Send } from "lucide-react";
import { useGetFileList } from "app/hook/useGetFileList";
import { FilePickerModal } from "../FilePickerModel";

import {
  allMessages,
  currentUserId,
  selectedCommunication,
  selectedWorkspaceId,
} from "@context/workspaceContext";
import { useSocketStore } from "@context/SocketContext";

interface WorkspaceChannel {
  id: string;
  name: string;
  description?: string | null;
  isPrivate: boolean;
}

interface RecentFile {
  id: string;
  name: string;
  type: "canvas" | "doc" | "list";
  updatedAt: string;
  createdAt: string;
  desc?: string;
  workspaceId: string;
  sharedBy?: string;
}

export default function Message() {
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const workspaceId = selectedWorkspaceId((state) => state.value);
  const selected = selectedCommunication((state) => state.data) as {
    value?: WorkspaceChannel;
  };

  const userId = currentUserId((state) => state.value);
  const socket = useSocketStore((state) => state.socket);
  const messages = allMessages((state) => state.data);
  const setMessages = allMessages((state) => state.set);

  const [showFilePicker, setShowFilePicker] = useState(false);
  const [selectedFile, setSelectedFile] = useState<RecentFile | null>(null);

  const { getAllFileList } = useGetFileList();
  const [allFiles, setAllFiles] = useState<RecentFile[]>([]);

  useEffect(() => {
    if (!socket || !selected.value?.id) return;

    socket.emit("join-channel", { channelId: selected.value?.id });

    // Listen for new messages
    const handleNewMessage = (msg: any) => {
      // Only add if the message is for the current channel
      if (msg.channelId === selected.value?.id) {
        setMessages([...messages, msg]);
      }

    };

    socket.on("channel-newMessage", handleNewMessage);

    // Cleanup
    return () => {
      socket.off("channel-newMessage", handleNewMessage);
    };
  }, [socket, selected.value?.id, messages, setMessages]);

  const handleSend = () => {
  if (!socket) return;

  // If sending a file
  if (selectedFile) {
    socket.emit("channel-sendMessage", {
      message, // or a caption if you want
      workspaceId,
      channelId: selected.value?.id,
      userId,
      
      type: selectedFile.type, // "canvas" | "doc" | "list"
      // Send the correct ID based on type
      canvasId: selectedFile.type == "canvas" ? selectedFile.id : null,
      docId: selectedFile.type == "doc" ? selectedFile.id : null,
      listId: selectedFile.type == "list" ? selectedFile.id : null,
    });
    setSelectedFile(null);
    setMessage("");
    return;
  }

  // If sending a text message
  if (message.trim()) {
    socket.emit("channel-sendMessage", {
      message,
      workspaceId,
      channelId: selected.value?.id,
      userId,
      type: "text",
    });
    setMessage("");
  }
};

  const handleFileAttach = async () => {
    if (workspaceId) {
      const data = await getAllFileList(workspaceId);
      if (Array.isArray(data)) setAllFiles(data);
    }
    setShowFilePicker(true);
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  const toggleEmojiPicker = () => {
    setShowEmojiPicker((prev) => !prev);
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Implement your file upload logic here
      alert(`Selected file: ${file.name}`);
    }
  };

  // Add emoji to message
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleEmojiSelect = (emoji: any) => {
    setMessage((prev) => prev + emoji.native);
    setShowEmojiPicker(false);
  };

  return (
    <div className="flex flex-col h-full ">
      <div className="flex-1 overflow-y-auto">
        <UpperTemplate />
        <MessageUI />
      </div>

      <div className="border-t border-gray-200 bg-white py-2 px-4 sticky bottom-0 z-10">
        <div className="flex items-center gap-2 bg-[#f7f7f9] rounded-full px-3 py-2 shadow-sm border border-gray-200">
          <button
            className="p-2 rounded-full hover:bg-gray-100 transition"
            onClick={handleFileAttach}
            type="button"
            aria-label="Attach file"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l7.07-7.07a4 4 0 10-5.657-5.657l-7.071 7.07a6 6 0 108.485 8.486l7.071-7.072"
              />
            </svg>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
            />
          </button>

          {/* Show selected file as a chip */}
          {selectedFile && (
            <div className="bg-gray-200 rounded px-2 py-1 text-sm flex items-center gap-2 ml-2">
              <span>{selectedFile.name}</span>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setSelectedFile(null)}
                type="button"
                aria-label="Remove file"
              >
                ×
              </button>
            </div>
          )}
          {/* Emoji Picker */}
          <div className="relative">
            <button
              className="p-2 rounded-full hover:bg-gray-100 transition"
              onClick={toggleEmojiPicker}
              type="button"
              aria-label="Emoji"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </button>
            {showEmojiPicker && (
              <div className="absolute bottom-12 left-0 z-50">
                <Picker onSelect={handleEmojiSelect} theme="light" />
              </div>
            )}
          </div>

          {/* Message Input */}
          <textarea
            value={message}
            onChange={handleMessageChange}
            placeholder="Message #all-testing"
            className="flex-1 bg-transparent outline-none resize-none px-2 py-1 rounded-full min-h-[36px] max-h-32 text-sm"
            rows={1}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            style={{ lineHeight: "1.5", marginTop: 0, marginBottom: 0 }}
          />

          {/* Send Button */}
          <button
            className={`ml-2 flex items-center gap-1 px-4 py-2 rounded-full font-semibold transition text-white bg-gradient-to-r from-[#00b289] to-[#007A5A] shadow-md hover:from-[#00c99a] hover:to-[#32947A] disabled:opacity-60 disabled:cursor-not-allowed`}
            onClick={handleSend}
            type="button"
            aria-label="Send"
            disabled={!message.trim()}
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </div>
      </div>

      {showFilePicker && (
        <FilePickerModal
          files={allFiles}
          onSelect={setSelectedFile}
          onClose={() => setShowFilePicker(false)}
        />
      )}
    </div>
  );
}
