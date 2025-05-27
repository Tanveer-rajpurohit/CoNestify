"use client"
import { useRouter } from "next/navigation";
import Image from "next/image";

const Page = () => {

  const navigate = useRouter()


  return (
    <>
      <div className="w-full bg-[#ffffff] text-[#171717] h-screen "
       style={{
          fontFamily: "Poppins",
        }}>
        <div className="create-workspace w-full h-[70vh] bg-[#f9f6f1] py-8 px-6">
          <header className="flex flex-col items-center justify-center gap-2 ">
            <h2 className="text-lg font-semibold">CoNestify</h2>

            <div className="mt-2 bg-[#f9f2f2b5] px-2 py-0.5 rounded-full flex items-center justify-center">
              <h2 className="text-xs text-gray-800">confirmed as <span className="font-semibold">tanveer@gmail.com</span> <span className="text-gray-400 hover:underline"
              onClick={()=>{
                navigate.push("/login")
              }}
              >change</span></h2>
            </div>
          </header>

          <div className="mt-4 w-full flex items-center justify-center gap-4 px-28">
            <div className="w-[27%] px-2 py-1.5 flex flex-col gap-2">
              <h2 className="text-2xl font-semibold leading-tight mb-1">
              Create a new CoNestify workspace
              </h2>

              <p className="text-md text-gray-800 mt-0.5 leading-relaxed">
              CoNestify gives your team a home — a place where they can talk, work together, and manage projects together.
              </p>

              <div className="mt-2 text-center text-white">
              <button
                type="submit"
                className="w-full px-4 py-3 bg-[#007A5A] rounded-md hover:bg-[#32947A] transition-colors text-sm font-semibold shadow-md"
                onClick={()=>{
                  navigate.push("/workspace/create")
                }}
              >
                Create Team
              </button>
              </div>
              
              <p className="text-xs text-gray-600 mt-1 leading-snug">
              A workspace is a place where you can create and manage your projects.
              </p>
            </div>
            <div className="w-[30%] px-2 py-1.5 flex items-center justify-center ">
            
              <Image
                src="/icons-conference-call-online-meeting-group-chat-communication-team-woman-man-512.png"
                alt="Workspace Illustration"
                className="rounded-lg shadow-lg object-contain w-full max-w-[340px] h-auto"
                width={340}
                height={220}
                style={{
                  background: "transparent",
                  backgroundColor: "transparent",
                  mixBlendMode: "multiply",
                  WebkitMaskImage: "linear-gradient(white, white)",
                  maskImage: "linear-gradient(white, white)"
                }}
                priority
              />
              
            </div>
          </div>
        </div>
          
        <div className="workspace w-full py-8 px-6 relative bg-white text-[#171717]">
          <div className="absolute w-16 h-16 flex items-center justify-center bg-[#ffffff] border border-[#fdfeff] rounded-full -top-8 left-1/2 text-gray-400 font-semibold -translate-x-1/2">
            OR
          </div>

          <div className="mt-10 w-full flex flex-col md:flex-row items-center justify-center gap-8">
            {/* Open Workspace Section */}
            <div className="flex-1 max-w-md bg-[#f9f6f1] rounded-lg shadow p-6 flex flex-col items-center">
              <h3 className="text-lg font-semibold mb-2">Open an Existing Workspace</h3>
              <p className="text-sm text-gray-700 mb-4 text-center">
                Already have a workspace? Enter your workspace link or code to access it.
              </p>
             
              {/* List of joined workspaces */}
              <div className="w-full">
                <h4 className="text-sm font-semibold mb-2">Your Workspaces</h4>
                <ul className="space-y-2">
                  {/* Example static data, replace with dynamic data */}
                  {[
                    { id: 1, name: "Design Team", description: "UI/UX Projects" },
                    { id: 2, name: "Marketing", description: "Campaigns & Content" },
                  ].map((ws) => (
                    <li key={ws.id} className="flex items-center justify-between bg-white rounded px-3 py-2 shadow-sm">
                      <div>
                        <div className="font-medium">{ws.name}</div>
                        <div className="text-xs text-gray-500">{ws.description}</div>
                      </div>
                      <button
                        className="ml-4 px-3 py-1 bg-[#007A5A] rounded hover:bg-[#32947A] text-white text-xs font-semibold"
                        onClick={() => {
                          // navigate to workspace
                          navigate.push(`/workspace/${ws.id}/home`);
                        }}
                      >
                        Visit
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Invitation to Join Workspace Section */}
            <div className="flex-1 max-w-md bg-[#f9f6f1] rounded-lg shadow p-6 flex flex-col items-center">
              <h3 className="text-lg font-semibold mb-2">Join a Workspace by Invitation</h3>
              <p className="text-sm text-gray-700 mb-4 text-center">
                If you received an invitation, paste your invite link below to join the workspace.
              </p>
             
              {/* List of invitations */}
              <div className="w-full">
                <h4 className="text-sm font-semibold mb-2">Invitations</h4>
                <ul className="space-y-2">
                  {/* Example static data, replace with dynamic data */}
                  {[
                    { id: 101, name: "Product Team", from: "alice@company.com" },
                    { id: 102, name: "QA Group", from: "bob@company.com" },
                  ].map((invite) => (
                    <li key={invite.id} className="flex items-center justify-between bg-white rounded px-3 py-2 shadow-sm">
                      <div>
                        <div className="font-medium">{invite.name}</div>
                        <div className="text-xs text-gray-500">Invited by {invite.from}</div>
                      </div>
                      <button
                        className="ml-4 px-3 py-1 bg-[#007A5A] rounded hover:bg-[#32947A] text-white text-xs font-semibold"
                        onClick={() => {
                          // handle join workspace
                          navigate.push(`/workspace/join/${invite.id}`);
                        }}
                      >
                        Join
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
