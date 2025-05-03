"use client"

import React from "react"
import {
  User2,
  EllipsisVertical,
} from "lucide-react"
import { useSidebarSelectionCommunication } from "@context/SidebarSeletion";
import SelecteFileTab from "../SelecteFileTab";


const DMNav = () => {
  const selectedCommunication = useSidebarSelectionCommunication((state) => state.data)

  return (
    <div className="w-full border-b border-[#EBEEF0]">
      {/* Top nav */}
      <div className="nav py-2 flex items-center justify-between px-4 ">
            <div className="name flex items-center justify-center gap-2">
                <div className="w-7 h-7 bg-cyan-300 rounded-md flex items-center justify-center">
                    <User2 className="w-5 h-5 text-white "/>
                </div>
              <h2 className="text-2xl font-medium">
                {selectedCommunication.value}
              </h2>
             
            </div>

            <div className="">

              <div className="p-1 text-[#4A5565] hover:bg-[#dfdfdf] hover:text-[#1f1f1f] rounded-md">
                <EllipsisVertical className="w-5 h-5  fill-[#4A5565]" />
              </div>
            </div>
      </div>

      {/* Tab Section */}
      <SelecteFileTab/>
    </div>
  )
}

export default DMNav
