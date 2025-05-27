"use client";

import { selectedFileType } from "@context/FilesContext";
import AllFilesList from "./file/AllFilesList";
import RecentlyFilesList from "./file/RecentlyFilesList";

const Files = () => {
  const { value: fileType } = selectedFileType();

 
  const onFileClick = (fileId: string, workspaceId: number, fileType: string) => {

    if(fileType === "canvas"){

      window.location.href = `/workspace/${workspaceId}/canvas/${fileId}`;
    }
    else if(fileType === "document"){

      window.location.href = `/workspace/${workspaceId}/docs/${fileId}`;
    }
    else if(fileType === "list"){

      window.location.href = `/workspace/${workspaceId}/lists/${fileId}`;
    }

  };

  return (
    <>
      <div className="w-full h-full relative bg-[#F8F8F8]">
        <div className="absolute inset-0 z-0 bg-[radial-gradient(100%_50%_at_50%_0%,rgba(0,163,255,0.13)_0%,rgba(0,163,255,0)_50%,rgba(0,163,255,0)_100%)]"></div>

        <div className="relative z-10 h-full">
          {fileType === "Recently viewed" && <RecentlyFilesList onFileClick={onFileClick} />}
          {fileType === "All files" && <AllFilesList onFileClick={onFileClick} />}
        </div>
      </div>
    </>
  );
};

export default Files;
