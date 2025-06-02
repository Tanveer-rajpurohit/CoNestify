"use client";
import React, { useEffect, useState } from "react";
import { ChevronDown, Edit, Plus } from "lucide-react";
import { IoHourglassOutline } from "react-icons/io5";
import { PiChatCircleDotsLight, PiHeadphonesLight } from "react-icons/pi";
import { AddChannelDialog } from "../../components/add-channel-dialog";
import { InvitePeopleDialog } from "../../components/invite-people-dialog";
import {
  currentUserId as currentUserIdStore,
  selectedWorkspaceId,
  workspaceContext,
  selectedCommunication,
} from "@context/workspaceContext";
import { useGetWorkspaceData } from "app/hook/useGetWorkspaceData";
import { RingLoader } from "react-spinners";

const HomeSidebar = () => {
  const [showChannels, setShowChannels] = useState(true);
  const [showDirectMessages, setShowDirectMessages] = useState(true);
  const [addChannelOpen, setAddChannelOpen] = useState(false);
  const [invitePeopleOpen, setInvitePeopleOpen] = useState(false);

  const selected = selectedCommunication();

  const workspaceId = selectedWorkspaceId();
  const { WorkspaceData: fetchWorkspaceData, loading } = useGetWorkspaceData();

  const workspace = workspaceContext();
  const currentUserId = currentUserIdStore();

  useEffect(() => {
    if (workspaceId.value) {
      fetchWorkspaceData(workspaceId.value).then((data) => {
        if (data && data.workspace) {
          workspace.setData(data.workspace[0]);
          currentUserId.set(data.currentUserId);
          selected.set({
            value: data.workspace[0].channels[0],
            type: "channel",
          });
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspaceId.value]);

  return (
    <>
      <div className="h-full w-[21.8rem] bg-[#cfcac377] rounded-tl-md rounded-bl-md">
        <div className="w-full px-4 py-3 text-white border-b border-[#cfcac377]">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start gap-1 px-1.5 py-0.5 hover:bg-[#f4f1f145] backdrop-blur-2xl rounded-md">
              <h1 className="text-xl ">
                {workspace.data ? workspace.data.name : "Workspace"}
              </h1>
              <ChevronDown className="w-4 h-4" />
            </div>
            <Edit className="w-5 h-5 text-gray-200/98" />
          </div>

          <div className="mt-5 w-full px-3 py-1.5 bg-white rounded-lg text-black flex items-center justify-between">
            <div className="flex items-center justify-start gap-3">
              <IoHourglassOutline />
              <h1 className="text-md font-medium">free trial</h1>
            </div>
          </div>
        </div>

        <div className="w-full pt-5 pb-2 px-3 text-[#f1f1f1]">
          {loading && (
            <div className="flex flex-col items-center justify-center h-32">
              <RingLoader color="#007A5A" size={40} />
              <p className="text-gray-500 mt-2">Loading workspace...</p>
            </div>
          )}

          {!loading && workspace.data && (
            <>
              {/* Meet & Chat */}
              <div className="meet&chat flex items-start justify-center flex-col gap-2">
                {[
                  {
                    id: "chat",
                    name: "Chat",
                    icon: <PiChatCircleDotsLight className="w-5 h-5" />,
                  },
                  {
                    id: "meet",
                    name: "Meet",
                    icon: <PiHeadphonesLight className="w-5 h-5" />,
                  },
                ].map(({ id, name, icon }) => (
                  <div
                    key={id}
                    onClick={() =>
                      selected.set({
                        value: id, // or just a string identifier
                        type: id as "chat" | "meet",
                      })
                    }
                    className={`w-full text-md px-3 py-0.5 flex items-center justify-start gap-2.5 rounded-md cursor-pointer ${
                      selected.data.value === id
                        ? "bg-white text-[#171717]"
                        : "hover:bg-[#f4f1f145] text-[#f1f1f1]"
                    }`}
                  >
                    {icon}
                    <h1 className="text-md font-medium">{name}</h1>
                  </div>
                ))}
              </div>

              {/* Channels */}
              <div className="channels mt-6">
                <div
                  onClick={() => setShowChannels(!showChannels)}
                  className="drop text-lg flex items-center justify-start px-2.5 cursor-pointer select-none"
                >
                  <div className="p-0.5 hover:bg-[#f4f1f145] rounded-md flex items-center justify-center">
                    <ChevronDown
                      className={`w-5 h-5 transform transition-transform duration-200 ${
                        showChannels ? "rotate-0" : "-rotate-90"
                      }`}
                    />
                  </div>
                  <h1 className="text-md font-medium hover:bg-[#f4f1f145] rounded-md px-2 py-0.5">
                    Channels
                  </h1>
                </div>

                {showChannels && workspace.data.channels && (
                  <div className="flex items-start justify-center text-md flex-col mt-1.5">
                    {workspace.data.channels.map((channel) => {
                      const id = channel.id;
                      return (
                        <div
                          key={id}
                          onClick={() =>
                            selected.set({ value: channel, type: "channel" })
                          }
                          className={`w-full px-3 py-0.5 flex items-center justify-start gap-2.5 rounded-md cursor-pointer ${
                            selected.data.type === "channel" &&
                            typeof selected.data.value === "object" &&
                            selected.data.value !== null &&
                            "id" in selected.data.value &&
                            selected.data.value.id === id
                              ? "bg-white text-[#171717]"
                              : "hover:bg-[#f4f1f145] text-[#f1f1f1]"
                          }`}
                        >
                          <p className="text-md pl-1.5">#</p>
                          <h1 className="text-md font-medium">
                            {channel.name}
                          </h1>
                        </div>
                      );
                    })}

                    <div
                      className="w-full px-3 py-0.5 flex items-center justify-start gap-2.5 hover:bg-[#f4f1f145] rounded-md cursor-pointer"
                      onClick={() => setAddChannelOpen(true)}
                    >
                      <Plus className="w-4 h-4 " />
                      <h1 className="text-md font-medium ">Add Channels</h1>
                    </div>
                  </div>
                )}
              </div>

              {/* Direct Messages */}
              <div className="people mt-3">
                <div
                  onClick={() => setShowDirectMessages(!showDirectMessages)}
                  className="drop flex items-center text-md justify-start px-2.5 cursor-pointer select-none"
                >
                  <div className="p-0.5 hover:bg-[#f4f1f145] rounded-md flex items-center justify-center">
                    <ChevronDown
                      className={`w-5 h-5 transform transition-transform duration-200 ${
                        showDirectMessages ? "rotate-0" : "-rotate-90"
                      }`}
                    />
                  </div>
                  <h1 className="text-md font-medium hover:bg-[#f4f1f145] rounded-md px-2 py-0.5">
                    Direct messages
                  </h1>
                </div>

                {showDirectMessages && workspace.data.members && (
                  <div className="flex items-start text-md justify-center flex-col mt-1.5">
                    {workspace.data.members.map((member) => {
                      const id = member.user.id;
                      const isSelf = member.user.id === currentUserId.value;
                      return (
                        <div
                          key={id}
                          onClick={() =>
                            selected.set({ value: member, type: "dm" })
                          }
                          className={`w-full px-3 py-0.5 flex items-center justify-start gap-2.5 rounded-md cursor-pointer ${
                            typeof selected.data.value === "object" &&
                            selected.data.value !== null &&
                            "user" in selected.data.value &&
                            selected.data.value.user.id === id
                              ? "bg-white text-[#171717]"
                              : "hover:bg-[#f4f1f145] text-[#f1f1f1]"
                          }`}
                        >
                          <div className="w-5 h-5 bg-[#5739b3] flex items-center justify-center rounded-md text-white text-xs cursor-pointer">
                            {member.user.name
                              ? member.user.name.charAt(0).toUpperCase()
                              : member.user.email.charAt(0).toUpperCase()}
                          </div>
                          <h1 className="text-md font-medium">
                            {member.user.name || member.user.email}{" "}
                            {isSelf && (
                              <span className="text-[#645f5fcf]">you</span>
                            )}
                          </h1>
                        </div>
                      );
                    })}

                    <div
                      className="w-full px-3 py-0.5 flex items-center justify-start gap-2.5 hover:bg-[#f4f1f145] rounded-md cursor-pointer"
                      onClick={() => setInvitePeopleOpen(true)}
                    >
                      <Plus className="w-4 h-4 " />
                      <h1 className="text-md font-medium ">Invite people</h1>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Dialogs */}
      <AddChannelDialog
        open={addChannelOpen}
        onOpenChange={setAddChannelOpen}
        workspaceId={workspaceId.value ?? ""}
      />

      <InvitePeopleDialog
        open={invitePeopleOpen}
        onOpenChange={setInvitePeopleOpen}
        workspaceName={workspace.data?.name || ""}
        workspaceId={workspaceId.value ?? ""}
      />
    </>
  );
};

export default HomeSidebar;
