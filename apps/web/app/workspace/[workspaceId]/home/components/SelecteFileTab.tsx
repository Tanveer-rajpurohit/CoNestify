import React, { useState } from "react";
import {
  ChevronDown,
  MessageCircle,
  ClipboardList,
  BookMarked,
  ListTodo,
  Zap,
  Plus,
  Link,
  FileText,
  FolderClosed,
} from "lucide-react";
// This would come from your context in a real app

const VISIBLE_TABS = [
  {
    id: "Messages",
    icon: <MessageCircle className="w-4 h-4" />,
    label: "Messages",
  },
  {
    id: "Resources",
    icon: <BookMarked className="w-4 h-4" />,
    label: "Organization Resources",
  },
  {
    id: "Weekly",
    icon: <ClipboardList className="w-4 h-4" />,
    label: "Weekly 1:1",
  },
  {
    id: "Untitled",
    icon: <ClipboardList className="w-4 h-4" />,
    label: "Untitled",
  },
  { id: "Todo", icon: <ListTodo className="w-4 h-4" />, label: "To-do list" },
  { id: "Workflows", icon: <Zap className="w-4 h-4" />, label: "Workflows" },
  {
    id: "Bookmarks",
    icon: <BookMarked className="w-4 h-4" />,
    label: "Bookmarks",
  },
];

const HIDDEN_TABS = [
  {
    id: "SlackLink",
    icon: <Link className="w-4 h-4" />,
    label: "https://app.slack.c...",
  },
  {
    id: "NewDeal",
    icon: <FileText className="w-4 h-4" />,
    label: "New deal: All items",
  },
  {
    id: "Untitled2",
    icon: <ClipboardList className="w-4 h-4" />,
    label: "Untitled",
  },
];

const MORE_OPTIONS = [
  {
    id: "Canvas",
    icon: <ClipboardList className="w-4 h-4" />,
    label: "Canvas",
  },
  { id: "List", icon: <FileText className="w-4 h-4" />, label: "List" },
  {
    id: "BookmarkFolder",
    icon: <FolderClosed className="w-4 h-4" />,
    label: "Bookmark folder",
  },
  { id: "EditTabs", icon: null, label: "Edit tabs", divider: true },
];

const SelecteFileTab = () => {
  const [activeTab, setActiveTab] = useState("Messages");
  const [showMore, setShowMore] = useState(false);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  return (
    <>
    <div className="flex items-center px-4 relative">
        <div className="flex-1 overflow-x-auto scrollbar-hide">
          <div className="flex items-center min-w-max">
            {VISIBLE_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-3 flex items-center gap-1.5 ${
                  activeTab === tab.id
                    ? "border-b-2 border-[#1264A3] text-[#1D1C1D] font-medium"
                    : "text-[#616061] hover:text-[#1D1C1D]"
                }`}
              >
                {tab.icon}
                <span className="text-md whitespace-nowrap">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* More Tab */}
        <div className="relative">
          <button
            onClick={() => {
              setShowMore(!showMore);
              setShowMoreOptions(false);
            }}
            className="py-2 px-3 flex items-center gap-2 text-[#616061] hover:text-[#1D1C1D] transition duration-300 ease-in-out"
          >
            <span className="text-sm font-medium">More</span>
            <ChevronDown className="w-4 h-4" />
          </button>

          {showMore && (
            <div className="absolute z-10 bg-white mt-2 rounded-lg shadow-lg border border-[#DDDFE2] w-64 right-0 transition-all duration-300 ease-in-out">
              {HIDDEN_TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setShowMore(false);
                  }}
                  className="w-full px-4 py-3 hover:bg-[#F8F8F8] flex items-center gap-2 text-[#1D1C1D] text-left transition duration-200 ease-in-out"
                >
                  {tab.icon}
                  <span className="text-sm truncate">{tab.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* More Options Button */}
        <div className="relative ml-1">
          <button
            onClick={() => {
              setShowMoreOptions(!showMoreOptions);
              setShowMore(false);
            }}
            className="py-2 px-2 text-[#616061] hover:text-[#1D1C1D] transition duration-300 ease-in-out"
          >
            {showMoreOptions ? (
              <Plus className="w-5 h-5 rotate-[225deg]" />
            ) : (
              <Plus className="w-5 h-5" />
            )}
          </button>

          {showMoreOptions && (
            <div className="absolute z-10 bg-white mt-2 rounded-lg shadow-lg border border-[#DDDFE2] w-64 right-0">
              {MORE_OPTIONS.map((option) => (
                <React.Fragment key={option.id}>
                  {option.divider && (
                    <div className="border-t border-[#DDDFE2] my-2"></div>
                  )}
                  <button
                    onClick={() => {
                      setShowMoreOptions(false);
                    }}
                    className="w-full px-4 py-3 hover:bg-[#F8F8F8] flex items-center gap-2 text-[#1D1C1D] text-left transition duration-200 ease-in-out"
                  >
                    {option.icon}
                    <span className="text-sm">{option.label}</span>
                  </button>
                </React.Fragment>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
export default SelecteFileTab