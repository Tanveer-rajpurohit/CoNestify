"use client";

import React from "react";
import { ChevronDown, Edit, Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useSidebarSelectionCommunication } from "@context/SidebarSeletion";

const suggestions = [
  { label: "Tanveer Singh", isYou: true, color: "#512DA8" },
  { label: "Tanveer", isYou: false, color: "#2da881" },
  { label: "User1", isYou: false, color: "#f39c12" },
];

const DMsSidebar = () => {
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const selectedUser = useSidebarSelectionCommunication((state)=>state.data.value)
  const setSelectedUser = useSidebarSelectionCommunication((state)=>state.set)


  useEffect(()=>{
    setSelectedUser({value:"Tanveer Singh",type:"channel"})
  }, [setSelectedUser])

  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredSuggestions = suggestions.filter((s) =>
    s.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setSearchOpen(false);
      }
    };

    if (isSearchOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSearchOpen]);

  return (
    <div className="h-full w-[21.8rem] bg-[#cfcac377] rounded-tl-md rounded-bl-md">
      {/* Header */}
      <div className="w-full px-4 py-3 text-white border-b border-[#cfcac377]">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start gap-1 px-1.5 py-0.5 hover:bg-[#f4f1f145] backdrop-blur-2xl rounded-md">
            <h1 className="text-2xl font-bold">Direct messages</h1>
            <ChevronDown className="w-4 h-4" />
          </div>
          <Edit className="w-5 h-5 text-gray-200/98" />
        </div>
      </div>

      {/* Search */}
      <div className="w-full relative pt-5 pb-2 text-[#f1f1f1]">
        <div className="h-[1.9rem] w-full px-3">
          <div
            onClick={() => setSearchOpen(true)}
            className="rounded-md bg-[#cfcac3b8] border border-[#e1e1e185] px-4 py-1 flex items-center justify-between cursor-pointer hover:bg-[#d7d2cd]"
          >
            <input
              type="text"
              className="w-full p-1 outline-none text-sm bg-transparent placeholder:text-[#eee]"
              placeholder="Search people"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            <Search className="w-3 h-3 text-white" />
          </div>
        </div>

        {/* Search Dropdown */}
        {isSearchOpen && (
          <div
            ref={dropdownRef}
            className="absolute w-[93%] mx-3 bg-white text-[#1f1f1f] shadow-xl rounded-md z-50"
          >
            <div className="p-3 border-b border-gray-300 flex justify-between items-center">
              <Search className="w-4 h-4 text-gray-500" />
              <div className="w-full p-1 text-sm">{searchQuery}</div>
              <X
                className="w-4 h-4 cursor-pointer"
                onClick={() => {
                  setSearchQuery("");
                  setSearchOpen(false);
                }}
              />
            </div>

            <div className="max-h-60 overflow-y-auto">
              {filteredSuggestions.map((item, i) => (
                <div
                  key={i}
                  onClick={() => {
                    setSearchOpen(false);
                    setSearchQuery(item.label)
                    setSelectedUser({value:item.label,type:"channel"});
                  }}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-sm cursor-pointer"
                >
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Users List */}
        <div className="mt-8 border-t border-gray-300 flex flex-col">
          {suggestions.map((user, index) => (
            <div
              key={index}
              onClick={() => 
                setSelectedUser({value:user.label,type:"channel"})
              }
              className={`border-b border-[#cfcac3] hover:bg-[#f4f1f137] w-full px-3 py-3 flex justify-start items-center gap-3 ${
                selectedUser === user.label ? "bg-[#f4f1f137]" : ""
              }`}
            >
              <div
                className="icon w-7 h-7 rounded-sm flex items-center justify-center text-white font-semibold"
                style={{ backgroundColor: user.color }}
              >
                {user.label.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <h2>
                  {user.label}{" "}
                  {user.isYou && (
                    <span className="text-gray-100 font-normal">(you)</span>
                  )}
                </h2>
                {user.isYou && (
                  <p className="text-[#402e248d] text-sm">
                    This is your space. Draft messages, list your to-dos, or
                    keep links and files handy.
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DMsSidebar;
