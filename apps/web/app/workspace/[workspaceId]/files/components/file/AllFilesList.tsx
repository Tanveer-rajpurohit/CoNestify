"use client";

import { Search, List, Grid, Brush, ListTodo, FileText } from "lucide-react";
import { JSX, useEffect, useRef, useState } from "react";
import FileCard from "./file-card";
import SortDropdown from "./sort-dropdown";
import DateFilterDropdown from "./date-filter-dropdown";
import FileTypeFilterDropdown from "./file-type-filter-dropdown";
import { selectedWorkspaceId } from "@context/workspaceContext";
import { useGetFileList } from "app/hook/useGetFileList";
import { RingLoader } from "react-spinners";
import Image from "next/image";

export type FileType = "canvas" | "document" | "list" | "doc";
export type ViewedDate = "today" | "yesterday" | "older";
export type ViewMode = "list" | "grid";
export type SortOption =
  | "recently_viewed"
  | "a_to_z"
  | "z_to_a"
  | "newest"
  | "oldest";
export type DateFilter =
  | "any_time"
  | "today"
  | "yesterday"
  | "last_7_days"
  | "last_30_days"
  | "last_3_months"
  | "last_12_months";

export interface FileItem {
  id: string;
  name: string;
  type: FileType;
  updatedAt: string;
  createdAt: string;
  workspaceId: string;
  createdBy: {
    id: true;
    name: true;
    email: true;
    image: true;
  };
}

export interface FileTypeMeta {
  icon: JSX.Element;
  bg: string;
}

export const fileTypeData: Record<FileType | "unknown", FileTypeMeta> = {
  canvas: {
    icon: <Brush className="w-4 h-4 text-white" />,
    bg: "bg-[#1CB6EB]",
  },
  document: {
    icon: <FileText className="w-4 h-4 text-white" />,
    bg: "bg-[#E19B06]",
  },
  doc: {
    icon: <FileText className="w-4 h-4 text-white" />,
    bg: "bg-[#E19B06]",
  },
  list: {
    icon: <ListTodo className="w-4 h-4 text-white" />,
    bg: "bg-[#7D7DE3]",
  },
  unknown: {
    icon: <FileText className="w-4 h-4 text-white" />,
    bg: "bg-gray-400",
  },
};

function getViewedDate(updatedAt: string) {
  const date = new Date(updatedAt);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const fileDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diff = today.getTime() - fileDay.getTime();
  if (diff === 0) return "today";
  if (diff === 86400000) return "yesterday";
  return "older";
}

interface AllFilesListProps {
  onFileClick: (
    fileId: string,
    workspaceId: string,
    fileType: FileType
  ) => void;
}

const AllFilesList = ({ onFileClick }: AllFilesListProps) => {
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [sortOption, setSortOption] = useState<SortOption>("recently_viewed");
  const [dateFilter, setDateFilter] = useState<DateFilter>("any_time");
  const [selectedFileTypes, setSelectedFileTypes] = useState<FileType[]>([
    "canvas",
    "document",
    "list",
  ]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { getAllFileList, loading } = useGetFileList();
  const workspaceId = selectedWorkspaceId();

  const [files, setFiles] = useState<FileItem[]>([]);

  useEffect(() => {
    if (workspaceId.value) {
      getAllFileList(workspaceId.value).then((data) => {
        if (Array.isArray(data)) setFiles(data);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspaceId.value]);

  // Filter files based on search query, date filter, and file type
  const filterFiles = () => {
    let filtered = files.filter((file) =>
      file.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // File type filter
    if (selectedFileTypes.length > 0) {
      filtered = filtered.filter((file) =>
        selectedFileTypes.includes(file.type === "doc" ? "document" : file.type)
      );
    }

    // Date filter
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const last7Days = new Date(today);
    last7Days.setDate(last7Days.getDate() - 7);
    const last30Days = new Date(today);
    last30Days.setDate(last30Days.getDate() - 30);
    const last3Months = new Date(today);
    last3Months.setMonth(last3Months.getMonth() - 3);
    const last12Months = new Date(today);
    last12Months.setMonth(last12Months.getMonth() - 12);

    switch (dateFilter) {
      case "today":
        filtered = filtered.filter((file) => new Date(file.createdAt) >= today);
        break;
      case "yesterday":
        filtered = filtered.filter(
          (file) =>
            new Date(file.createdAt) >= yesterday &&
            new Date(file.createdAt) < today
        );
        break;
      case "last_7_days":
        filtered = filtered.filter(
          (file) => new Date(file.createdAt) >= last7Days
        );
        break;
      case "last_30_days":
        filtered = filtered.filter(
          (file) => new Date(file.createdAt) >= last30Days
        );
        break;
      case "last_3_months":
        filtered = filtered.filter(
          (file) => new Date(file.createdAt) >= last3Months
        );
        break;
      case "last_12_months":
        filtered = filtered.filter(
          (file) => new Date(file.createdAt) >= last12Months
        );
        break;
      default:
        // "any_time" - no filtering needed
        break;
    }

    return filtered;
  };

  // Sort files based on the selected sort option
  const sortFiles = (files: FileItem[]) => {
    const sortedFiles = [...files];

    switch (sortOption) {
      case "a_to_z":
        sortedFiles.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "z_to_a":
        sortedFiles.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "newest":
        sortedFiles.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case "oldest":
        sortedFiles.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        break;
      case "recently_viewed":
      default: {
        // Sort by viewed date (today, yesterday, older)
        const priority: Record<ViewedDate, number> = {
          today: 1,
          yesterday: 2,
          older: 3,
        };
        sortedFiles.sort(
          (a, b) =>
            (priority[getViewedDate(a.updatedAt)] ?? 0) -
            (priority[getViewedDate(b.updatedAt)] ?? 0)
        );
        break;
      }
    }

    return sortedFiles;
  };

  const filteredAndSortedFiles = sortFiles(filterFiles());

  // Group files by viewed date for display
  const groupedFiles = filteredAndSortedFiles.reduce(
    (acc, file) => {
      const viewedDate = getViewedDate(file.updatedAt);
      acc[viewedDate] = acc[viewedDate] || [];
      acc[viewedDate].push(file);
      return acc;
    },
    {} as Record<string, FileItem[]>
  );

  // Outside, click listener for the search dropdown
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

  const toggleFileTypeSelection = (type: FileType) => {
    if (selectedFileTypes.includes(type)) {
      // If it's the only selected type, don't remove it
      if (selectedFileTypes.length === 1) return;
      setSelectedFileTypes(selectedFileTypes.filter((t) => t !== type));
    } else {
      setSelectedFileTypes([...selectedFileTypes, type]);
    }
  };

  return (
    <div className="p-6 md:p-8 lg:p-10 relative lg:px-28 h-full overflow-y-auto bg-white">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">All Files</h2>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3 mb-6 p-3 rounded-lg">
        {/* File Type Filter */}
        <FileTypeFilterDropdown
          selectedFileTypes={selectedFileTypes}
          toggleFileType={toggleFileTypeSelection}
        />

        {/* Date Filter */}
        <DateFilterDropdown
          selectedDateFilter={dateFilter}
          setDateFilter={setDateFilter}
        />

        <div className="ml-auto flex items-center gap-2">
          {/* Sort Dropdown */}
          <SortDropdown
            selectedSortOption={sortOption}
            setSortOption={setSortOption}
          />

          {/* View Toggle */}
          <div className="flex border border-gray-300 rounded-md overflow-hidden shadow-sm">
            <button
              className={`p-2 transition-colors ${
                viewMode === "list"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => setViewMode("list")}
              aria-label="List view"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              className={`p-2 transition-colors ${
                viewMode === "grid"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => setViewMode("grid")}
              aria-label="Grid view"
            >
              <Grid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

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

      {/* Loading Spinner */}
      {loading && (
        <div className="flex flex-col items-center justify-center h-32">
          <RingLoader color="#007A5A" size={40} />
          <p className="text-gray-500 mt-2">Loading files...</p>
        </div>
      )}

      {/* File Sections */}
      <div className="mt-4 flex flex-col gap-5">
        {!loading && Object.entries(groupedFiles).length > 0 ? (
          Object.entries(groupedFiles).map(([date, files]) => (
            <div key={date} className="mb-6">
              <h3 className="text-sm font-semibold text-gray-600 mb-3 capitalize">
                {date}
              </h3>
              {viewMode === "list" ? (
                <div className="rounded-lg bg-white border border-gray-200 flex flex-col shadow-sm overflow-hidden">
                  {files.map((file) => {
                    const typeKey =
                      fileTypeData[file.type] !== undefined
                        ? file.type
                        : "unknown";
                    return (
                      <div
                        onClick={() =>
                          onFileClick(
                            file.id,
                            workspaceId.value as string,
                            file.type as FileType
                          )
                        }
                        key={file.id}
                        className="px-4 py-3 flex items-center gap-3 border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <div
                          className={`w-10 h-10 rounded-md flex items-center justify-center shrink-0 ${
                            fileTypeData[typeKey].bg
                          } shadow-sm`}
                        >
                          <div className="scale-125">
                            {fileTypeData[typeKey].icon}
                          </div>
                        </div>
                        <div className="flex flex-col gap-1 flex-grow">
                          <span className="truncate text-base font-medium text-gray-800">
                            {file.name}
                          </span>
                          <span className="truncate text-xs text-gray-500">
                            {new Date(file.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full overflow-hidden">
                            <Image
                              className="w-full h-full object-cover"
                              width={40}
                              height={40}
                              src={
                                typeof file.createdBy.image === "string"
                                  ? file.createdBy.image
                                  : "/placeholder-image.jpg"
                              } 
                              alt={String(file.createdBy.name ?? "User image")} 
                            />
                          </div>
                          <div className="ml-2">
                            <p className="text-sm font-medium">
                              {file.createdBy.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {file.createdBy.email}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {files.map((file) => (
                    <FileCard
                      key={file.id}
                      file={file}
                      onFileClick={onFileClick}
                    />
                  ))}
                </div>
              )}
            </div>
          ))
        ) : !loading ? (
          <div className="text-center py-12 text-gray-500 bg-white rounded-lg border border-gray-200 shadow-sm">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-lg">No files match your search criteria</p>
            <p className="text-sm mt-2">
              Try adjusting your filters or search term
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default AllFilesList;
