"use client";
import { type FileItem, type FileType } from "./AllFilesList";
import { fileTypeData } from "./AllFilesList";


interface FileCardProps {
  file: FileItem;
  onFileClick: (fileId: string, workspaceId: string, fileType: FileType) => void;
}

const FileCard = ({ file,onFileClick }: FileCardProps) => {
  const typeKey = fileTypeData[file.type] ? file.type : "unknown";
  let createdDate = "No date";
  try {
    createdDate = file.createdAt
      ? new Date(file.createdAt).toLocaleDateString()
      : "No date";
  } catch {
    createdDate = "No date";
  }

  return (
    <div
      onClick={() =>
        onFileClick(file.id, file.workspaceId, file.type as FileType)
      }
      className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200 cursor-pointer group flex flex-col items-center py-6"
    >
      {/* Icon Badge */}
      <div
        className={`w-16 h-16 rounded-xl flex items-center justify-center ${fileTypeData[typeKey].bg} shadow-lg mb-4`}
      >
        <div className="scale-150">{fileTypeData[typeKey].icon}</div>
      </div>

      {/* File Info */}
      <h3 className="font-semibold text-gray-900 text-base text-center truncate mb-1">
        {file.name}
      </h3>
      <div className="flex items-center justify-center gap-2 text-xs text-gray-500 mb-1">
        <span>{createdDate}</span>
      </div>
      <div className="flex items-center justify-center gap-1 mt-1">
        <span
          className={`w-2 h-2 rounded-full ${fileTypeData[typeKey].bg}`}
        ></span>
        <span className="capitalize text-xs">{typeKey}</span>
      </div>
    </div>
  );
};

export default FileCard;
