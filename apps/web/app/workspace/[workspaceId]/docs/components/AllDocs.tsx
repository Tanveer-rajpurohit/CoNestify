"use client";
import { Plus, Search, FileText, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { RingLoader } from "react-spinners";
import { useGetFileList } from "app/hook/useGetFileList";
import { useCreateFile } from "app/hook/useCreateFile";
import { selectedWorkspaceId } from "@context/workspaceContext";
import Image from "next/image";

export interface DocFile {
  id: string;
  title: string;
  desc?: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  workspaceId: string;
  createdBy: {
    id: true;
    name: true;
    email: true;
    image: true;
  };
}

interface AllDocsProps {
  onFileClick: (id: string, workspaceId: string) => void;
}

const AllDocs = ({ onFileClick }: AllDocsProps) => {
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [files, setFiles] = useState<DocFile[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newDocName, setNewDocName] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { getDocsList, loading } = useGetFileList();
  const { loading: isCreating, createDocs } = useCreateFile();
  const workspaceId = selectedWorkspaceId();

  useEffect(() => {
    if (workspaceId.value) {
      getDocsList(workspaceId.value).then((data) => {
        if (Array.isArray(data)) setFiles(data);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspaceId.value]);

  const filterFiles = () => {
    return files.filter((file) =>
      file.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const Files = filterFiles();

  // Fetch docs
  const fetchDocs = () => {
    if (workspaceId.value) {
      getDocsList(workspaceId.value).then((data) => {
        if (Array.isArray(data)) setFiles(data);
      });
    }
  };

  useEffect(() => {
    fetchDocs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspaceId.value]);

const handleCreateDoc = async () => {
  if (!newDocName.trim() || !workspaceId.value) return;
  await createDocs(workspaceId.value, newDocName.trim());
  fetchDocs();
  setShowCreateModal(false);
  setNewDocName("");
};

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setSearchOpen(false);
      }
    };

    if (isSearchOpen || showCreateModal) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSearchOpen, showCreateModal]);

  return (
    <>
      <div className="p-6 md:p-8 lg:p-10 relative lg:px-28 h-full">
        <div className="w-full flex items-center justify-between mb-6 relative">
          <h2 className="text-xl font-semibold text-gray-800">All Documents</h2>
          <div
            ref={dropdownRef}
            onClick={() => setShowCreateModal(true)}
            className={`create flex items-center justify-center gap-1 bg-[#007A5A] px-3 py-1 rounded-md transition-colors text-[#ffffff] hover:bg-[#007A5A]/80 cursor-pointer ${isCreating ? "opacity-60 pointer-events-none" : ""}`}
          >
            <Plus className="w-4 h-4" />
            <h2 className="text-md">New</h2>
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

        {/* file */}
        <div className="mt-4 flex flex-col gap-5">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-32">
              <RingLoader color="#007A5A" size={40} />
              <p className="text-gray-500 mt-2">Loading all documents...</p>
            </div>
          ) : Files.length > 0 ? (
            <div className="mb-6">
              <div className="rounded-lg bg-white border border-gray-200 flex flex-col shadow-sm overflow-hidden">
                {Files.map((file) => (
                  <div
                    key={file.id}
                    onClick={() =>
                      onFileClick(file.id, file.workspaceId)
                    }
                    className="px-4 py-3 flex items-center gap-3 border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <div
                      className={`w-10 h-10 rounded-md flex items-center justify-center shrink-0 bg-[#E19B06] shadow-sm`}
                    >
                      <div className="scale-125">
                        <FileText className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1 flex-grow">
                      <span className="truncate text-base font-medium text-gray-800">
                        {file.title}
                      </span>
                      <span className="truncate text-xs text-gray-400">
                        {new Date(file.createdAt).toLocaleDateString()}
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
                ))}
              </div>
            </div>
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

        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-sm flex flex-col items-center relative">
              <button
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
                onClick={() => {
                  setShowCreateModal(false);
                  setNewDocName("");
                }}
                disabled={isCreating}
              >
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-xl font-semibold mb-4">Create New Document</h2>
              <input
                type="text"
                className="border border-gray-300 rounded px-3 py-2 w-full mb-4"
                placeholder="Enter document name"
                value={newDocName}
                onChange={(e) => setNewDocName(e.target.value)}
                disabled={isCreating}
                autoFocus
              />
              <button
                className={`bg-[#007A5A] text-white px-4 py-2 rounded w-full font-medium transition-colors ${isCreating ? "opacity-60 cursor-not-allowed" : "hover:bg-[#00664a]"}`}
                onClick={handleCreateDoc}
                disabled={isCreating || !newDocName.trim()}
              >
                {isCreating ? "Creating..." : "Create"}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AllDocs;