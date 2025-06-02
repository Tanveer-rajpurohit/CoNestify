import { selectedDocsType } from "@context/DocsContext";
import AllDocs from "./AllDocs";
import { selectedWorkspaceId } from "@context/workspaceContext";
import { useEffect } from "react";

const Docs = () => {
  const { value: fileType } = selectedDocsType();
  const onFileClick = (fileId: string, workspaceId: number) => {
    window.location.href = `/workspace/${workspaceId}/docs/${fileId}`;
  };

  const workspaceId = selectedWorkspaceId();
  
    useEffect(() => {
        if (!workspaceId.value) {
          const pathParts = window.location.pathname.split("/");
          const id = pathParts[2] ?? null;
          workspaceId.set(id as string);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);
  return (
    <>
      <div className="w-full min-h-screen relative">
        <div className="absolute inset-0 z-0 bg-[#F8F8F8] bg-[radial-gradient(100%_50%_at_50%_0%,rgba(0,163,255,0.13)_0%,rgba(0,163,255,0)_50%,rgba(0,163,255,0)_100%)"></div>

        <div className="relative z-10 h-full">
          {fileType === "All Docs" && <AllDocs onFileClick={onFileClick} />}
        </div>
      </div>
    </>
  );
};
export default Docs;
