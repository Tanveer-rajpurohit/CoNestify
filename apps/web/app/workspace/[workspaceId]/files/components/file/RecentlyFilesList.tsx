"use client";
import { Search, Brush, ListTodo, FileText } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { JSX } from "react/jsx-dev-runtime";

type FileType = "canvas" | "document" | "list";

export type ViewedDate = "today" | "yesterday" | "older";

export interface FileItem {
  id: string;
  name: string;
  type: FileType;
  viewedDate: ViewedDate;
  createdDate: Date;
  desc: string;
  thumbnail?: string;
  sharedBy?: string;
}

export interface FileTypeMeta {
  icon: JSX.Element;
  bg: string;
}
const allFiles: FileItem[] = [
  {
    id: "1",
    name: "Canvas Design",
    type: "canvas",
    viewedDate: "today",
    createdDate: new Date(2023, 3, 18),
    desc: "A design for the new project",
    thumbnail: "/placeholder.svg?height=200&width=300",
    sharedBy: "Slackbot",
  },
  {
    id: "2",
    name: "To-do Doc",
    type: "document",
    viewedDate: "today",
    createdDate: new Date(2023, 3, 18),
    desc: "A design for the new project",
    sharedBy: "Tanveer Singh",
  },
  {
    id: "3",
    name: "Task List",
    type: "list",
    viewedDate: "yesterday",
    createdDate: new Date(2023, 3, 14),
    desc: "A design for the new project",
    sharedBy: "Tanveer Singh",
  },
  {
    id: "4",
    name: "UX Sketch Design",
    type: "canvas",
    viewedDate: "yesterday",
    createdDate: new Date(2023, 3, 14),
    desc: "A design for the new project",
    thumbnail: "/placeholder.svg?height=200&width=300",
    sharedBy: "tan",
  },
  {
    id: "5",
    name: "Notes Draft",
    type: "document",
    viewedDate: "yesterday",
    createdDate: new Date(2023, 3, 14),
    desc: "A design for the new project",
    thumbnail: "/placeholder.svg?height=200&width=300",
    sharedBy: "Tanveer Singh",
  },
  {
    id: "6",
    name: "Client Table",
    type: "list",
    viewedDate: "today",
    createdDate: new Date(2023, 3, 18),
    desc: "A design for the new project",
    sharedBy: "Tanveer Singh",
  },
];
// Icons for file types
const fileTypeData: Record<FileType, FileTypeMeta> = {
  canvas: {
    icon: <Brush className="w-4 h-4 text-white" />,
    bg: "bg-[#1CB6EB]",
  },
  document: {
    icon: <FileText className="w-4 h-4 text-white" />,
    bg: "bg-[#E19B06]",
  },
  list: {
    icon: <ListTodo className="w-4 h-4 text-white" />,
    bg: "bg-[#7D7DE3]",
  },
};

const RecentlyFilesList = () => {
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filterFiles = () => {
    const filtered = allFiles.filter((file) => file.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return filtered;
  };

  // Sort files based on selected sort option
  const sortFiles = (files: FileItem[]) => {
    const sortedFiles = [...files];

    const priority: Record<ViewedDate, number> = {
      today: 1,
      yesterday: 2,
      older: 3,
    };
    sortedFiles.sort(
      (a, b) => (priority[a.viewedDate] ?? 0) - (priority[b.viewedDate] ?? 0)
    );

    return sortedFiles;
  };

  const filteredAndSortedFiles = sortFiles(filterFiles());

  const groupedFiles = filteredAndSortedFiles.reduce(
    (acc, file) => {
      acc[file.viewedDate] = acc[file.viewedDate] || [];
      (acc[file.viewedDate] = acc[file.viewedDate] || []).push(file);
      return acc;
    },
    {} as Record<string, FileItem[]>
  );

  // Outside click listener
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setSearchOpen(false);
      }
    };

    if (isSearchOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSearchOpen]);

  return (
    <div className="p-6 md:p-8 lg:p-10 relative lg:px-28 h-full ">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        Recently viewed
      </h2>

      {/* Search Bar */}
     <div
        onClick={() => setSearchOpen(true)}
        className="rounded-lg mb-6 bg-white border border-gray-300 px-4 py-1.5 flex items-center justify-between cursor-text hover:shadow-md transition-shadow"
      >
        <input
          type="text"
          className="w-full outline-none text-base bg-transparent placeholder:text-gray-400"
          placeholder="Search files..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Search className="w-5 h-5 text-gray-500" />
      </div>


      {/* File Sections */}
      <div className="mt-4 flex flex-col gap-5">
        {Object.entries(groupedFiles).length > 0 ? (
          Object.entries(groupedFiles).map(([date, files]) => (
            <div key={date} className="mb-6">
              <h3 className="text-sm font-semibold text-gray-600 mb-3 capitalize">
                {date}
              </h3>

                <div className="rounded-lg bg-white border border-gray-200 flex flex-col shadow-sm overflow-hidden">
                  {files.map((file) => (
                    <div
                      key={file.id}
                      className="px-4 py-3 flex items-center gap-3 border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <div
                        className={`w-10 h-10 rounded-md flex items-center justify-center shrink-0 ${
                          fileTypeData[file.type].bg
                        } shadow-sm`}
                      >
                        <div className="scale-125">
                          {fileTypeData[file.type].icon}
                        </div>
                      </div>
                      <div className="flex flex-col gap-1 flex-grow">
                        <span className="truncate text-base font-medium text-gray-800">
                          {file.name}
                        </span>
                        <span className="truncate text-xs text-gray-500">
                          {file.sharedBy && `Shared by ${file.sharedBy}`} ·{" "}
                          {file.createdDate.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-gray-500 bg-white rounded-lg border border-gray-200 shadow-sm">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-lg">No files match your search criteria</p>
            <p className="text-sm mt-2">
              Try adjusting your filters or search term
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentlyFilesList;
