"use client";

import React from "react";
import {
  ChevronDown,
  User2,
  EllipsisVertical,
} from "lucide-react";
import { PiHeadphonesLight } from "react-icons/pi";
import { useSidebarSelectionCommunication } from "@context/SidebarSeletion";
import SelecteFileTab from "../SelecteFileTab";



const ChannelNav = () => {
  const selectedCommunication = useSidebarSelectionCommunication(
    (state) => state.data
  );


  return (
    <div className="w-full border-b border-[#EBEEF0]">
      {/* Top nav */}
      <div className="nav py-2 flex items-center justify-between px-4 ">
        <div className="name flex items-baseline justify-center gap-3">
          <h2 className="text-2xl font-medium">
            # {selectedCommunication.value}
          </h2>
          <p className="text-xs text-[#1d1c1dc3]">
            Your go-to channel for organizational resources
          </p>
        </div>

        <div className="flex items-center justify-between gap-2">
          <div className="members px-1 py-1 flex items-center justify-center gap-1 rounded-md border border-[#E6E6E6] hover:bg-[#dfdfdf] hover:text-[#1f1f1f] text-[#4A5565]">
            <div className="w-5 h-5 rounded-sm bg-[#44BEDF] flex items-center justify-center text-white">
              <User2 className="w-4 h-4 " />
            </div>
            <h4 className="text-sm font-mono px-1">2</h4>
          </div>

          <div className="meet  flex items-center justify-between rounded-md border border-[#E6E6E6] text-[#4A5565] ">
            <div className="px-1 py-1 pr-2 flex items-center justify-baseline gap-1 hover:bg-[#dfdfdf] hover:text-[#1f1f1f] rounded-sm">
              <div className="w-5 h-5 rounded-sm  flex items-center justify-center ">
                <PiHeadphonesLight className="w-5 h-5 " />
              </div>
              <h4 className="text-sm ">Meet</h4>
            </div>
            <div className="border-l border-[#E6E6E6]  px-1 py-1.5 overflow-hidden rounded-sm  hover:bg-[#dfdfdf] hover:text-[#1f1f1f]">
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>

          <div className="p-1 text-[#4A5565] hover:bg-[#dfdfdf] hover:text-[#1f1f1f] rounded-md">
            <EllipsisVertical className="w-5 h-5  fill-[#4A5565]" />
          </div>
        </div>
      </div>

      {/* Tab Section */}
      <SelecteFileTab/>
    </div>
  );
};

export default ChannelNav;
