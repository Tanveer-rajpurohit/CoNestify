"use client";

import { Clock, Layers } from "lucide-react";
import { selectedFileType } from "@context/FilesContext";

const FilesSidebar = () => {
    const {value:fileType, set: setFileType} = selectedFileType();
    

  const FileTypeData = [
    { name: "Recently viewed", icon: <Clock className="w-4 h-4" /> },
    { name: "All files", icon: <Layers className="w-4 h-4" /> },
  ];

  return (
    <>
      <div className="h-full w-[21.8rem] bg-[#cfcac377] rounded-tl-md rounded-bl-md">
        <div className="w-full px-4 py-3 text-white border-b border-[#cfcac377]">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start gap-1 px-1.5 py-0.5 hover:bg-[#f4f1f145] backdrop-blur-2xl rounded-md">
              <h1 className="text-xl ">File</h1>
            </div>
          </div>
        </div>

        <div className="w-full pb-2 px-3 text-[#f1f1f1]">
          {/* Channels */}
          <div className="channels mt-2">
            <div className="flex items-start justify-center text-md flex-col ">
              {FileTypeData.map((file, idx) => {
                return (
                  <div
                    key={idx}
                    onClick={() => setFileType(file.name)}
                    className={`w-full px-3 py-0.5 flex items-center justify-start gap-2.5 rounded-md cursor-pointer ${
                        fileType === file.name
                        ? "bg-white text-[#171717]"
                        : "hover:bg-[#f4f1f145] text-[#f1f1f1]"
                    }`}
                  >
                    {file.icon}
                    <h1 className="text-md font-medium">{file.name}</h1>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FilesSidebar;
