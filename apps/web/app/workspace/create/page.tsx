"use client";
import { Users } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCreateWorkspace } from "app/hook/useCreateWorkspace";

const Page = () => {
  const navigate = useRouter();
  const [teamName, setTeamName] = useState("Tanveer's Workspace");
  const [teamDescription, setTeamDescription] = useState(
    "Workspace Description"
  );
  const [teamInvite, setTeamInvite] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate.push("/login");
    }
  }, [navigate]);

  const { createWorkspace, loading, error } = useCreateWorkspace();

  function isValidEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  const handleCreateTeam = async () => {
    try {
      const emails = teamInvite
        .split(/[\s,]+/)
        .map((email) => email.trim())
        .filter((email) => email.length > 0);

      // Validate all emails
      const invalidEmails = emails.filter((email) => !isValidEmail(email));
      if (invalidEmails.length > 0) {
        alert(`Invalid email(s): ${invalidEmails.join(", ")}`);
        return;
      }

      const result = await createWorkspace({
        name: teamName,
        description: teamDescription,
        invitations: emails,
      });

      console.log("Workspace created!", result);
      if (result) {
        navigate.push("/workspace");
      }
    } catch (err) {
      console.error("Failed to create workspace:", err);
    }
  };

  return (
    <>
      <div className="w-full bg-[#F8F8F8] text-[#171717] h-screen  py-8 px-6">
        <nav className="w-full flex justify-between items-baseline px-5 py-1">
          <div className="flex items-center justify-center gap-2 ">
            <h2 className="text-lg ">CoNestify</h2>
          </div>
        </nav>

        <div className="w-full h-[85vh] flex flex-col items-center justify-center ">
          <div className="px-3 -space-y-0.5 py-1.5 border-t border-[#6FCF97] bg-[#304A36] flex items-center justify-center gap-2 rounded-xl">
            <Users className="w-4 h-4 fill-[#6FCF97] text-[#6FCF97]" />
            <h3 className="text-sm text-[#6FCF97]">Workspace Name</h3>
          </div>

          <h2 className="text-2xl">What should we call your Workspace?</h2>
          <p className="text-sm">
            You can always change this later from settings.
          </p>

          <div className="mt-7">
            <form
              action=""
              onSubmit={(e) => {
                e.preventDefault();
                handleCreateTeam();
              }}
            >
              <div>
                <label htmlFor="name" className="text-base font-semibold">
                  Workspace Name
                </label>
                <br />
                <input
                  onChange={(e) => setTeamName(e.target.value)}
                  type="text"
                  name="name"
                  className="w-96 mt-1 px-3 py-2 rounded-md text-sm bg-[#FFFFFF] border border-[#D1D5DC] focus:outline-none text-[#171717]"
                  value={teamName}
                />
              </div>
              <div className="mt-3">
                <label
                  htmlFor="Description"
                  className="text-base font-semibold"
                >
                  Description
                </label>
                <br />
                <input
                  onChange={(e) => setTeamDescription(e.target.value)}
                  type="text"
                  name="Description"
                  className="w-96 mt-1 px-3 py-2 rounded-md text-sm bg-[#FFFFFF] border border-[#D1D5DC] focus:outline-none text-[#171717]"
                  value={teamDescription}
                />
              </div>
              <div className="mt-3">
                <label htmlFor="Invite" className="text-base font-semibold">
                  Invite
                </label>
                <br />
                <input
                  onChange={(e) => setTeamInvite(e.target.value)}
                  type="text"
                  name="Invite"
                  placeholder="Ex. ellis@gmail.com, ghost@gmail.com"
                  className="w-96 mt-1 px-3 py-2 rounded-md text-sm bg-[#FFFFFF] border border-[#D1D5DC] focus:outline-none text-[#171717]"
                  value={teamInvite}
                />
                {error && <div className="mt-2 text-red-500">{error}</div>}
              </div>

              <div className="mt-7 text-center text-white">
                <button
                  type="submit"
                  className="w-[65%] px-4 py-3 bg-[#007A5A] rounded-md hover:bg-[#32947A] transition-colors text-sm font-semibold"
                  disabled={loading}
                >
                  Create Team
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
