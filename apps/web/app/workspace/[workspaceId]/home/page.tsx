"use client"
import React, { useEffect } from "react";
import WorkspaceLayout from "../components/WorkspaceLayout";
import Home from "./components/Home";
import HomeSidebar from "./components/HomeSidebar";
import { selectedWorkspaceId } from "@context/workspaceContext";

const WorkspacePage = () => {
  const workspaceId = selectedWorkspaceId();

  useEffect(() => {
    const pathParts = window.location.pathname.split('/');
    const id = pathParts[2] ?? null;
    workspaceId.set(id as string);
    console.log("Workspace ID:", id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log("Workspace ID from context:", workspaceId.value);

  return (
    <WorkspaceLayout>
        <div className="h-full w-full bg-[#A69E97] pb-1 pr-1 flex items-start justify-start">
        {/* sidebar to show info base on user selection on sidenav */}
          <HomeSidebar/>
          {/* main content area */}
          <div className="h-full w-[calc(100%-26.35rem)] flex-1 bg-[#F8F8F8] rounded-tr-md rounded-br-md ">
            <Home/>
          </div>
          
        </div>
    </WorkspaceLayout>
  );
};

export default WorkspacePage;
