
"use client";
import React from "react"

import { ChevronDown, Edit, Plus } from "lucide-react";
import { IoHourglassOutline } from "react-icons/io5";
import { PiChatCircleDotsLight, PiHeadphonesLight } from "react-icons/pi";
import { useState } from "react";
import { AddChannelDialog } from "../../components/add-channel-dialog";
import { InvitePeopleDialog } from "../../components/invite-people-dialog";
import { useSidebarSelectionCommunication } from "@context/SidebarSeletion";

const HomeSidebar = () => {
  const [showChannels, setShowChannels] = useState(true);
  const [showDirectMessages, setShowDirectMessages] = useState(true);
  const [addChannelOpen, setAddChannelOpen] = useState(false);
  const [invitePeopleOpen, setInvitePeopleOpen] = useState(false);


  
  const selected = useSidebarSelectionCommunication((state) => state.data);
const setSelected = useSidebarSelectionCommunication((state) => state.set);


  const channels = [
    { name: "all-testing"},
    { name: "social"},
  ];

  const directMessages = [
    { name: "Tanveer", self: false },
    { name: "Tanveer Singh", self: true },
  ];

  return (
    <>
      <div className="h-full w-[21.8rem] bg-[#cfcac377] rounded-tl-md rounded-bl-md">
        <div className="w-full px-4 py-3 text-white border-b border-[#cfcac377]">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start gap-1 px-1.5 py-0.5 hover:bg-[#f4f1f145] backdrop-blur-2xl rounded-md">
              <h1 className="text-xl ">testing</h1>
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
          {/* Chat / Meet */}
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
                onClick={() => setSelected({ value: id, type: id as "chat" | "meet" })}
                className={`w-full text-md px-3 py-0.5 flex items-center justify-start gap-2.5 rounded-md cursor-pointer ${
                    selected.value === id
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

            {showChannels && (
              <div className="flex items-start justify-center text-md flex-col mt-1.5">
                {channels.map((channel, idx) => {
                  const id = `${channel.name}`;
                  return (
                    <div
                      key={idx}
                      onClick={() => setSelected({ value: id, type: "channel" })}

                      className={`w-full px-3 py-0.5 flex items-center justify-start gap-2.5 rounded-md cursor-pointer ${
                        selected.value === id
                          ? "bg-white text-[#171717]"
                          : "hover:bg-[#f4f1f145] text-[#f1f1f1]"
                      }`}
                    >
                      <p className="text-md pl-1.5">#</p>
                      <h1 className="text-md font-medium">{channel.name}</h1>
                    </div>
                  );
                })}

                <div
                  className="w-full px-3 py-0.5 flex items-center justify-start gap-2.5 hover:bg-[#f4f1f145] rounded-md cursor-pointer"
                  onClick={() => setAddChannelOpen(true)}
                >
                  <Plus className="w-4 h-4 " />
                  <h1 className="text-md font-medium ">
                    Add Channels
                  </h1>
                </div>
              </div>
            )}
          </div>

          {/* Direct Messages */}
          <div className="channels mt-3">
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

            {showDirectMessages && (
              <div className="flex items-start text-md justify-center flex-col mt-1.5">
                {directMessages.map((person, idx) => {
                  const id = `${person.name}`;
                  return (
                    <div
                      key={idx}
                      onClick={() => setSelected({ value: id, type: "dm" })}

                      className={`w-full px-3 py-0.5 flex items-center justify-start gap-2.5 rounded-md cursor-pointer ${
                        selected.value === id
                          ? "bg-white text-[#171717]"
                          : "hover:bg-[#f4f1f145] text-[#f1f1f1]"
                      }`}
                    >
                      <div className="w-5 h-5 bg-[#5739b3] flex items-center justify-center rounded-md text-white text-xs cursor-pointer">
                        T
                      </div>
                      <h1 className="text-md font-medium">
                        {person.name}{" "}
                        {person.self && (
                            
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
                  <h1 className="text-md font-medium ">
                    Invite people
                  </h1>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <AddChannelDialog
        open={addChannelOpen}
        onOpenChange={setAddChannelOpen}
      />

      <InvitePeopleDialog
        open={invitePeopleOpen}
        onOpenChange={setInvitePeopleOpen}
        workspaceName="testing"
      />
    </>
  );
};

export default HomeSidebar;
