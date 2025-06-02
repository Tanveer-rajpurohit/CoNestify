"use client";
import React, { useState, useEffect, useRef } from "react";
import { X, Link } from "lucide-react";
import { useSendInvitation } from "app/hook/useSendInvitation";

interface InvitePeopleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workspaceName?: string;
  workspaceId?: string;
}

export function InvitePeopleDialog({
  open,
  onOpenChange,
  workspaceName = "Workspace",
  workspaceId,
}: InvitePeopleDialogProps) {
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const {
    sendInvitation,
    loading,
    error: invitationError,
  } = useSendInvitation();

  // Handle click outside to close modal
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onOpenChange(false);
      }
    };
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, onOpenChange]);

  // Handle ESC key to close
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onOpenChange(false);
    };
    if (open) document.addEventListener("keydown", handleEscKey);
    return () => document.removeEventListener("keydown", handleEscKey);
  }, [open, onOpenChange]);

  function isValidEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  const handleSend = () => {
    const emails = input
      .split(/[\s,]+/)
      .map((email) => email.trim())
      .filter((email) => email.length > 0);

    const invalidEmails = emails.filter((email) => !isValidEmail(email));
    if (invalidEmails.length > 0) {
      setError(`Invalid email(s): ${invalidEmails.join(", ")}`);
      return;
    }

    if (!workspaceId) {
      setError("Workspace ID is missing.");
      return;
    }
    sendInvitation(workspaceId, emails).then(() => {
      window.location.reload();
    });

    setInput("");
    setError(null);
    onOpenChange(false);
  };

  const inviteLink = `https://example.com/invite/${workspaceName.replace(/\s+/g, "-").toLowerCase()}`;
  const handleCopy = () => {
    navigator.clipboard.writeText(inviteLink);
    alert("Invite link copied to clipboard!");
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-lg w-[420px] max-w-[95vw] max-h-[95vh] p-6"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">
            Invite people to {workspaceName}
          </h2>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Invite by email
          </label>
          <input
            type="text"
            placeholder="Ex. ellis@gmail.com, ghost@gmail.com"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setError(null);
            }}
          />
          {error && <div className="text-xs text-red-500 mt-1">{error}</div>}
          {invitationError && (
            <div className="text-xs text-red-500 mt-1">{invitationError}</div>
          )}
        </div>

        {/* Invite link section */}
        <div className="bg-gray-50 p-3 rounded-md flex items-center gap-2 mb-4">
          <Link className="h-4 w-4 text-blue-500" />
          <span className="text-sm text-gray-700 truncate">{inviteLink}</span>
          <button
            className="ml-auto px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
            onClick={handleCopy}
            disabled={loading}
            type="button"
          >
            Copy
          </button>
        </div>

        <div className="flex justify-end">
          <button
            className={`py-2 px-4 rounded-md text-white ${
              input.trim()
                ? "bg-blue-500 hover:bg-blue-600"
                : "bg-blue-300 cursor-not-allowed"
            }`}
            onClick={handleSend}
            disabled={!input.trim()}
          >
            Send Invites
          </button>
        </div>
      </div>
    </div>
  );
}
