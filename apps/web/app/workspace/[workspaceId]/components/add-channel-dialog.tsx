/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { useCreateChannel } from "app/hook/useCreateChannel";

interface AddChannelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workspaceId: string;
}

export function AddChannelDialog({
  open,
  onOpenChange,
  workspaceId
}: AddChannelDialogProps) {
  const [channelName, setChannelName] = useState("");
  const [description, setDescription] = useState("");
  const modalRef = useRef<HTMLDivElement>(null);

  const { createChannel, loading, error } = useCreateChannel();

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onOpenChange(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, onOpenChange]);

  // Handle ESC key to close
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onOpenChange(false);
      }
    };

    if (open) {
      document.addEventListener("keydown", handleEscKey);
    }

    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [open, onOpenChange]);

  const handleSubmit = () => {
    // Handle channel creation logic here
    console.log("Creating channel:", { channelName, description });
    onOpenChange(false);

    createChannel(workspaceId,channelName, description).then(()=>{
      window.location.reload();
    })
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-lg overflow-hidden w-[1180px] max-w-[95vw] max-h-[95vh] flex"
      >
        {/* Left side - Form */}
        <div className="w-[39%] p-6">
          <div className="mb-4">
            <div className="flex items-center">
              <button
                className="mr-2 text-gray-500 hover:text-gray-700"
                onClick={() => onOpenChange(false)}
              >
                ← Back
              </button>
              <h2 className="text-xl font-bold">Channel details</h2>
            </div>
          </div>

          <div className="space-y-6">
            {/* Channel Name */}
            <div className="space-y-2">
              <label
                htmlFor="channel-name"
                className="block text-sm font-medium"
              >
                Channel name
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-500">#</span>
                <input
                  id="channel-name"
                  type="text"
                  placeholder="e.g. plan-budget"
                  className="w-full px-8 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={channelName}
                  maxLength={25}
                  onChange={(e) => setChannelName(e.target.value)}
                />
                <span className="absolute right-3 top-2.5 text-gray-500 text-sm">
                  {25 - channelName.length}
                </span>
              </div>
              <p className="text-sm text-gray-500">
                Channels are where conversations happen around a topic. Use a
                name that is easy to find and understand.
              </p>
            </div>

            {/* Channel Description */}
            <div className="space-y-2">
              <label
                htmlFor="channel-description"
                className="block text-sm font-medium"
              >
                Description <span className="text-gray-400">(optional)</span>
              </label>
              <textarea
                id="channel-description"
                placeholder="Describe what this channel is for"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                value={description}
                maxLength={75}
                rows={3}
                onChange={(e) => setDescription(e.target.value)}
              />
              <div className="text-xs text-gray-400 text-right">
                {75 - description.length} characters left
              </div>
            </div>

            {error && <div className="text-red-500">{error}</div>}
            <button
              className={`w-full py-2 px-4 rounded-md text-white ${
                channelName.trim()
                  ? "bg-blue-500 hover:bg-blue-600"
                  : "bg-blue-300 cursor-not-allowed"
              }`}
              onClick={handleSubmit}
              disabled={loading || !channelName.trim()}
            >
              Create
            </button>
          </div>
        </div>

        {/* Right side - Preview */}
        <div className="w-[61%] bg-purple-50 p-6 flex flex-col">
          <div className="flex justify-between mb-4">
            <div></div>
            <button
              className="text-gray-500 hover:text-gray-700"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="bg-white rounded-lg p-6 flex-1">
            <img
              src={"/channelPlaceHolder.png"}
              alt="img"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
