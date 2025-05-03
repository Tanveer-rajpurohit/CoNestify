"use client";
import React from "react";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CircleHelp,
  Clock,
  Search,
  X,
  Bell,
  Pencil,
  ListTodo,
} from "lucide-react";

const suggestions = [
  {
    icon: <CircleHelp className="w-4 h-4" />,
    label: "Deactivate a member's account",
  },
  {
    icon: <CircleHelp className="w-4 h-4" />,
    label: "Deactivate your Slack account",
  },
  { icon: <CircleHelp className="w-4 h-4" />, label: "Delete a workspace" },
  {
    icon: <CircleHelp className="w-4 h-4" />,
    label: "Deploy Slack via Microsoft Installer",
  },
  {
    icon: <CircleHelp className="w-4 h-4" />,
    label: "Download Slack for Linux (beta)",
  },
  { icon: <Bell className="w-4 h-4" />, label: "DMs" },
  { icon: <Pencil className="w-4 h-4" />, label: "Drafts & sent" },
  { icon: <ListTodo className="w-4 h-4" />, label: "To-do list" },
];

const Navbar = () => {
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSuggestions = suggestions.filter((s) =>
    s.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="w-full h-[6%] bg-[#A69E97] flex items-center justify-start relative">
        <div className="h-full w-[25.3rem]"></div>

        <div className="flex items-center justify-between w-full py-1.5 pr-4">
          <div className="left flex items-center justify-start gap-3">
            <ArrowLeft className="w-5 h-5 text-white" />
            <ArrowRight className="w-5 h-5 text-white" />
            <Clock className="w-5 h-5 text-white" />

            {/* Search Bar */}
            <div className="h-[1.8rem] w-[37rem]">
              <div
                onClick={() => setSearchOpen(true)}
                className="w-full h-full rounded-md bg-[#cfcac377] px-4 py-1 flex items-center justify-between cursor-pointer hover:bg-[#d7d2cd]"
              >
                <h3 className="text-sm text-white">Search testing</h3>
                <Search className="w-3 h-3 text-white" />
              </div>
            </div>
          </div>

          <div className="right flex items-center justify-end gap-3 text-white">
            <button className="px-2 py-1 border border-white hover:bg-[#f4f1f129] rounded-md text-sm font-medium  transition">
              CoNestify Pro Trial
            </button>
            <CircleHelp className="w-5 h-5 text-white" />
          </div>
        </div>

        {/* Search Modal */}
        {isSearchOpen && (
          <div className="absolute top-[0.1rem] left-[22.5rem] bg-white shadow-xl w-[40rem] rounded-md z-50">
            {/* Header with Input */}
            <div className="p-3 border-b border-gray-300 flex justify-between items-center">
              <input
                type="text"
                className="w-full p-2 outline-none text-sm"
                placeholder="Search across people, channels, files, workflows, and more"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <X
                className="w-4 h-4 cursor-pointer"
                onClick={() => {
                  setSearchQuery("");
                  setSearchOpen(false);
                }}
              />
            </div>

            {/* Echo current query */}
            {searchQuery && (
              <div className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100">
                <Search className="w-4 h-4 text-gray-500" />
                <span>{searchQuery}</span>
              </div>
            )}

            {/* Suggestions */}
            <div className="max-h-60 overflow-y-auto">
              {filteredSuggestions.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-sm cursor-pointer"
                >
                  {item.icon}
                  <span>{item.label}</span>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="text-xs text-gray-500 text-right pr-4 pb-2">
              Not the results you expected?{" "}
              <a href="#" className="text-blue-600">
                Give feedback
              </a>{" "}
              or{" "}
              <a href="#" className="text-blue-600">
                learn more
              </a>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Navbar;
