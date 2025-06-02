import {
  Search,
  User2Icon,
  X,
  Dot,
  Mail,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { FaUserLarge } from "react-icons/fa6";
import { InvitePeopleDialog } from "../../components/invite-people-dialog";
import { selectedWorkspaceId } from "@context/workspaceContext";
import { useGetPeopleList } from "app/hook/useGetPeopleList";
import { RingLoader } from "react-spinners";
import Image from "next/image";

interface Member {
  id: string;
  joinedAt: string;
  role: string;
  user: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
  };
}

const People = () => {
  const workspaceId = selectedWorkspaceId();
  const { loading, WorkspacePeopleList } = useGetPeopleList();

  const [isSearchOpen, setSearchOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isInvite, setIsInvite] = useState<boolean>(false);
  // const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isProfile, setIsProfile] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [members, setMembers] = useState<Member[]>([]);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  useEffect(() => {
    if (!workspaceId.value) {
      const pathParts = window.location.pathname.split("/");
      const id = pathParts[2] ?? null;
      workspaceId.set(id as string);
      console.log("Workspace ID:", id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (workspaceId.value) {
      (async () => {
        const data = await WorkspacePeopleList(workspaceId.value!);
        console.log("Fetched members:", data.members);
        setMembers(data.members);
      })();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspaceId.value]);

  const filterFiles = () => {
    const filtered = members.filter((member) =>
      member?.user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return filtered;
  };

  const Users: Member[] = filterFiles();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setSearchOpen(false);
      }
    };

    if (isSearchOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    if (isInvite) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSearchOpen, isInvite]);

  return (
    <>
      <div className="p-6 md:p-8 lg:p-10 relative lg:px-28 h-full">
        <div className="w-full flex items-center justify-between mb-6 relative">
          <h2 className="text-xl font-semibold text-gray-800">All Peoples</h2>
          <div
            ref={dropdownRef}
            onClick={() => {
              setIsInvite(!isInvite);
            }}
            className="create flex items-center justify-center gap-1 border border-gray-500  px-3 py-1 rounded-md transition-colors text-[#111111] cursor-pointer"
          >
            <h2 className="text-md">Invite People</h2>
          </div>
        </div>

        {/* Search Bar */}
        <div
          onClick={() => setSearchOpen(true)}
          className="rounded-lg mb-6 bg-white border border-gray-300 px-4 py-1.5 flex items-center justify-between cursor-text hover:shadow-md transition-shadow"
        >
          <input
            type="text"
            className="w-full outline-none text-base bg-transparent placeholder:text-gray-400"
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="w-5 h-5 text-gray-500" />
        </div>

        <div className={`mt-8 pb-10 flex flex-col gap-5`}>
          {loading ? (
            <div className="flex flex-col items-center justify-center h-32">
              <RingLoader color="#007A5A" size={40} />
              <p className="text-gray-500 mt-2">
                Loading all workspace members...
              </p>
            </div>
          ) : Object.entries(Users).length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Users.map((member) => (
                <div
                  key={member.id}
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer group w-48"
                  onClick={() => {
                    setSelectedMember(member);
                    setIsProfile(true);
                  }}
                >
                  {/* Thumbnail or Preview */}
                  <div className="h-48 bg-gray-100 relative overflow-hidden rounded-b-md">
                    {member?.user.image ? (
                      <Image
                        src={member?.user.image}
                        alt={member?.user.name}
                        width={192}
                        height={192}
                        quality={90}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        priority
                        sizes="192px"
                        style={{ imageRendering: "auto" }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-50">
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="scale-150">
                            <User2Icon className="w-24 h-24 text-gray-600" />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="px-4 py-3 flex items-center justify-between bg-[#FFFFFF]">
                    <div className="flex items-start justify-start flex-col">
                      <h3 className="text-lg">
                        {member?.user.name}{" "}
                        <span className="text-xs text-gray-700">
                          {member.role}
                        </span>
                      </h3>
                      <h4
                        className="text-sm text-gray-500 max-w-[180px] truncate"
                        title={member?.user.email}
                      >
                        {member?.user.email}
                      </h4>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500 bg-white rounded-lg border border-gray-200 shadow-sm">
              <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-lg">No member match your search criteria</p>
              <p className="text-sm mt-2">
                Try adjusting your filters or search term
              </p>
            </div>
          )}
        </div>
      </div>

      {isInvite && (
        <InvitePeopleDialog
          open={isInvite}
          onOpenChange={() => setIsInvite(false)}
        />
      )}

      {isProfile && selectedMember && (
        <div className="absolute z-20 h-full w-[30%] top-0 right-0 bg-[#FFFFFF] shadow-2xl px-4 py-3.5 rounded-sm">
          <div className="data w-full flex items-center justify-between">
            <h2 className="text-xl font-bold">Profile</h2>
            <X onClick={() => setIsProfile(false)} className="w-5 h-5" />
          </div>

          <div className="icon w-full flex items-center justify-center mt-8">
            <div className="w-44 h-44 rounded-xl flex items-end justify-center overflow-hidden">
              {selectedMember.user.image ? (
                <Image
                  src={selectedMember.user.image}
                  alt={selectedMember.user.name}
                  width={208}
                  height={208}
                  className="w-44 h-44 object-cover"
                />
              ) : (
                <FaUserLarge className="w-44 h-44 text-white" />
              )}
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3">
            <h2 className="text-xl font-bold">{selectedMember.user.name}</h2>
            <div className=" flex items-center justify-start gap-2 text-gray-700">
              <Dot className="w-4 h-4" />
              {selectedMember.role}
            </div>
            {/* You can add more info here if available */}
          </div>

          <div className="contact mt-5">
            <h4 className="text-md font-semibold">Contact information</h4>
            <div className="flex items-start justify-start gap-3 mt-2">
              <div className="px-2 py-1.5 bg-[#F6F6F6] rounded-md">
                <Mail className="text-gray-800 w-[18px] h-[18px]" />
              </div>
              <div className="flex flex-col items-start justify-start">
                <h4 className="text-gray-800 text-sm">Email Address</h4>
                <h4 className="text-[#1264A3] hover:underline">
                  {selectedMember.user.email}
                </h4>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default People;
