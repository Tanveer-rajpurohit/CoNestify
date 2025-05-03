import WorkspaceLayout from "../components/WorkspaceLayout"
import Files from "./components/Files"
import FilesSidebar from "./components/FilesSidebar"

const page = () => {
  return (
    <>
    <WorkspaceLayout>
      <div className="h-full w-full bg-[#A69E97] pb-1 pr-1 flex items-start justify-start">
        {/* sidebar to show info base on user selection on sidenav */}
          <FilesSidebar/>
          {/* main content area */}
          <div className="h-full w-[calc(100%-26.35rem)] flex-1 bg-[#F8F8F8] rounded-tr-md rounded-br-md ">
            <Files/>
          </div>
          
        </div>
    </WorkspaceLayout>
    </>
  )
}
export default page