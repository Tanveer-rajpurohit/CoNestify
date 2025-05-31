"use client"
import React, { useEffect, useState } from "react";
import WorkspaceLayout from "../components/WorkspaceLayout";
import Home from "./components/Home";
import HomeSidebar from "./components/HomeSidebar";

const WorkspacePage = () => {
  const [workspaceId, setWorkspaceId] = useState<string | null>(null);

  useEffect(() => {
    const pathParts = window.location.pathname.split('/');
    const id = pathParts[2] ?? null;
    setWorkspaceId(id);
    console.log("Workspace ID:", id);
  }, []);

  console.log("Workspace ID from state:", workspaceId);

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
