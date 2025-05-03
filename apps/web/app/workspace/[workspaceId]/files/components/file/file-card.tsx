"use client"
import { type FileItem } from "./AllFilesList"
import { fileTypeData } from "@data/FileIcon"

interface FileCardProps {
  file: FileItem
}

const FileCard = ({ file }: FileCardProps) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer group">
      {/* Thumbnail or Preview */}
      <div className="h-40 bg-gray-100 relative overflow-hidden">
        {file.thumbnail ? (
          <img
            src={file.thumbnail || "/placeholder.svg"}
            alt={file.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-50">
            <div
              className={`w-16 h-16 rounded-md flex items-center justify-center ${fileTypeData[file.type].bg} shadow-md`}
            >
              <div className="scale-150">{fileTypeData[file.type].icon}</div>
            </div>
          </div>
        )}
      </div>

      {/* File Info */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <div
            className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 ${fileTypeData[file.type].bg} shadow-sm`}
          >
            {fileTypeData[file.type].icon}
          </div>
          <h3 className="font-semibold text-gray-800 truncate">{file.name}</h3>
        </div>
        <div className="text-xs text-gray-500 flex items-center gap-1">
          {file.sharedBy && (
            <>
              <span>Shared by {file.sharedBy}</span>
              <span className="inline-block w-1 h-1 bg-gray-300 rounded-full"></span>
            </>
          )}
          <span>{file.createdDate.toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  )
}

export default FileCard
