import React from "react";
import WorkspaceLayout from "../components/WorkspaceLayout";
import DMs from "./components/DMs";
import DMsSidebar from "./components/DMsSidebar";

const WorkspacePage = () => {
  return (
    <WorkspaceLayout>
      <div className="h-full w-full bg-[#A69E97] pb-1 pr-1 flex items-start justify-start">
        {/* sidebar to show info base on user selection on sidenav */}
          <DMsSidebar/>
          {/* main content area */}
          <div className="h-full w-[calc(100%-26.35rem)] flex-1 bg-[#F8F8F8] rounded-tr-md rounded-br-md ">
            <DMs/>
          </div>
          
        </div>
    </WorkspaceLayout>
  );
};

export default WorkspacePage;
