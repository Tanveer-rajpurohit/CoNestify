"use client";

import { selectedFileType } from "@context/FilesContext";
import AllFilesList from "./file/AllFilesList";
import RecentlyFilesList from "./file/RecentlyFilesList";
import { useRouter } from "next/navigation";

const Files = () => {
  const { value: fileType } = selectedFileType();

  const navigate = useRouter();
  const onFileClick = (fileId: string, workspaceId: number, fileType: string) => {

    if(fileType === "canvas"){

      navigate.push(`/workspace/${workspaceId}/canvas/${fileId}`);
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
