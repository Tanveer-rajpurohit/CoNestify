import React from "react";
import Navbar from "./Navbar";
import SideNav from "./SideNav";

interface WorkspaceLayoutProps {
  children: React.ReactNode;
}

const WorkspaceLayout: React.FC<WorkspaceLayoutProps> = ({ children }) => {
  return (
    <div className="w-full min-h-screen">
      <div
        className="relative w-full h-[100vh] bg-[#F1F1F1] overflow-hidden"
        style={{
          fontFamily: "Balthazar",
        }}
      >
        {/* Background gradient */}
        <div className="absolute inset-0 z-0 bg-white bg-[radial-gradient(100%_50%_at_50%_0%,rgba(0,163,255,0.13)_0%,rgba(0,163,255,0)_50%,rgba(0,163,255,0)_100%)]"></div>

        <div className="relative z-10 h-screen">
          <Navbar />
          <div className="w-full h-[94%] flex items-start justify-start">
            <SideNav />
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkspaceLayout;
