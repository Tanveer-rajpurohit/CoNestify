"use client";
import React from "react";
import { selectedCanvasType } from "@context/CanvasContext";
import AllCanvas from "./AllCanvas";
import CreatedByYou from "./CreatedByYou";
import { useRouter } from "next/navigation";

const Canvas = () => {
  const { value: fileType } = selectedCanvasType();
  const navigate = useRouter();
  const onFileClick = (fileId: string, workspaceId: number) => {
    navigate.push(`/workspace/${workspaceId}/canvas/${fileId}`);
  };
  return (
    <>
      <div className="w-full min-h-screen relative">
        <div className="absolute inset-0 z-0 bg-[#F8F8F8] bg-[radial-gradient(100%_50%_at_50%_0%,rgba(0,163,255,0.13)_0%,rgba(0,163,255,0)_50%,rgba(0,163,255,0)_100%)"></div>

        <div className="relative z-10 h-full">
          {fileType === "All canvases" && <AllCanvas onFileClick={onFileClick} />}
          {fileType === "Created by you" && <CreatedByYou onFileClick={onFileClick} />}
        </div>
      </div>
    </>
  );
};
export default Canvas;
