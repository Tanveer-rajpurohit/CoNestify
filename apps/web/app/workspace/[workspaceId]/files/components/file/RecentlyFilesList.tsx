"use client";
import { selectedWorkspaceId } from "@context/workspaceContext";
import { useGetFileList } from "app/hook/useGetFileList";
import { Search, Brush, ListTodo, FileText } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { RingLoader } from "react-spinners";

interface RecentFile {
  id: string;
  name: string;
  type: "canvas" | "doc" | "list";
  updatedAt: string;
  createdAt: string;
  desc?: string;
  workspaceId: string;
  sharedBy?: string;
  createdBy: {
    id: string;
    name: string;
    email: string;
    image: string;
  };
}

interface RecentlyFilesListProps {
  onFileClick: (
    fileId: string,
    workspaceId: string,
    fileType: RecentFile["type"]
  ) => void;
}

const fileTypeData = {
  canvas: {
    icon: <Brush className="w-4 h-4 text-white" />,
    bg: "bg-[#1CB6EB]",
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

const RecentlyFilesList = ({ onFileClick }: RecentlyFilesListProps) => {
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { getAllFileList, loading } = useGetFileList();
  const workspaceId = selectedWorkspaceId();

  const [files, setFiles] = useState<RecentFile[]>([]);

  useEffect(() => {
    if (workspaceId.value) {
      getAllFileList(workspaceId.value).then((data) => {
        if (Array.isArray(data)) setFiles(data);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspaceId.value]);

  // Filter and sort files
  const filteredFiles = files
    .filter((file) =>
      file.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );

  // Group files by viewed date
  const groupedFiles = filteredFiles.reduce(
    (acc, file) => {
      const viewedDate = getViewedDate(file.updatedAt);
      acc[viewedDate] = acc[viewedDate] || [];
      acc[viewedDate].push(file);
      return acc;
    },
    {} as Record<string, RecentFile[]>
  );

  // Outside click listener for search
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
    <div className="p-6 md:p-8 lg:p-10 relative lg:px-28 h-full overflow-y-auto bg-white">
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
              <div className="rounded-lg bg-white border border-gray-200 flex flex-col shadow-sm overflow-hidden">
                {files.map((file) => {
                  const typeKey = fileTypeData[file.type]
                    ? file.type
                    : "unknown";
                  return (
                    <div
                      onClick={() =>
                        onFileClick(
                          file.id,
                          workspaceId.value as string,
                          file.type
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
                          {file.sharedBy && `Shared by ${file.sharedBy}`}{" "}
                          {new Date(file.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                       <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full overflow-hidden">
                        <Image
                          className="w-full h-full object-cover"
                          width={40}
                          height={40}
                          src={file.createdBy.image}
                          alt={file.createdBy.name}
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

export default RecentlyFilesList;
