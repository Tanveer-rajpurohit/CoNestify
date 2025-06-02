"use client"

import React from "react"
import {
  User2,
  EllipsisVertical,
} from "lucide-react"
import SelecteFileTab from "../SelecteFileTab";

interface WorkspaceUser {
    id: string;
    name?: string | null;
    email: string;
}
interface WorkspaceMember {
    id: string;
    user: WorkspaceUser;
    role: string;
    joinedAt: string;
}

interface DMNavProps {
  selected: WorkspaceMember;
}

const DMNav = ({ selected }: DMNavProps) => {

  return (
    <div className="w-full border-b border-[#EBEEF0]">
      {/* Top nav */}
      <div className="nav py-2 flex items-center justify-between px-4 ">
            <div className="name flex items-center justify-center gap-2">
                <div className="w-7 h-7 bg-cyan-300 rounded-md flex items-center justify-center">
                    <User2 className="w-5 h-5 text-white "/>
                </div>
              <h2 className="text-2xl font-medium">
                {selected.user.name}
              </h2>

              <p className="text-xs text-[#1d1c1dc3]">
            {selected?.role}
          </p>
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
