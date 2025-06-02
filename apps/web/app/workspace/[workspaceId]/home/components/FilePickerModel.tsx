import React from "react";
import { Brush, ListTodo, FileText } from "lucide-react";

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

interface FilePickerModalProps {
  files: RecentFile[];
  onSelect: (file: RecentFile) => void;
  onClose: () => void;
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

export function FilePickerModal({ files, onSelect, onClose }: FilePickerModalProps) {
  return (
    <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Select a file</h2>
        <div className="max-h-72 overflow-y-auto">
          {files.length === 0 ? (
            <div className="text-gray-500 text-center py-8">No files found.</div>
          ) : (
            files.map((file) => {
              const typeKey = fileTypeData[file.type] ? file.type : "unknown";
              return (
                <div
                  key={file.id}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg mb-2 cursor-pointer hover:bg-gray-100 transition"
                  onClick={() => {
                    onSelect(file);
                    onClose();
                  }}
                >
                  <div
                    className={`w-10 h-10 rounded-md flex items-center justify-center shrink-0 ${fileTypeData[typeKey].bg} shadow-sm`}
                  >
                    {fileTypeData[typeKey].icon}
                  </div>
                  <div className="flex flex-col flex-grow">
                    <span className="truncate text-base font-medium text-gray-800">
                      {file.name}
                    </span>
                    <span className="truncate text-xs text-gray-500">
                      {file.type.charAt(0).toUpperCase() + file.type.slice(1)} •{" "}
                      {new Date(file.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
        <button
          className="mt-4 w-full px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}