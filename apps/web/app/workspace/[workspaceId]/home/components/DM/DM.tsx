"use client";
import {
  Clock,
  Dot,
  EllipsisVertical,
  Mail,
  MessageCircle,
  X,
} from "lucide-react";
import React from "react"

import { UserProfileVisiable } from "@context/UserProfile";
import MessageDM from "./Message";
import DMNav from "./DMNav";
import { FaUserLarge } from "react-icons/fa6";

const DM = () => {
  const { value: userProfile, set: setUserProfile } = UserProfileVisiable();

  return (
    <>
      <div className="w-full h-full flex flex-col relative">
        <div className="w-full h-full">
          <DMNav />

          {/* Tab Content */}
          <div className="w-full h-[86.1%] relative">
            <div className="absolute inset-0 z-0 bg-white bg-[radial-gradient(100%_50%_at_50%_0%,rgba(0,163,255,0.13)_0%,rgba(0,163,255,0)_50%,rgba(0,163,255,0)_100%)]"></div>

            <div className="relative z-10 h-full">
              <MessageDM />
            </div>
          </div>
        </div>
        {userProfile && (
          <div className="absolute z-20 h-full w-[40%] top-0 right-0 bg-[#FFFFFF] shadow-2xl px-4 py-3.5 rounded-sm">
            <div className="data w-full flex items-center justify-between">
              <h2 className="text-xl font-bold">Profile</h2>
              <X
                onClick={() => {
                  setUserProfile(!userProfile);
                }}
                className="w-5 h-5"
              />
            </div>

            <div className="icon w-full flex items-center justify-center mt-8">
              <div className="w-52 h-52 bg-[#44BEDF] rounded-xl flex items-end justify-center">
                <FaUserLarge className="w-44 h-44 text-white" />
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <h2 className="text-xl font-bold">tanveer</h2>
              <div className=" flex items-center justify-start gap-2 text-gray-700">
                <Dot className="w-4 h-4" />
                Away
              </div>
              <div className=" flex items-center justify-start gap-2 text-gray-700">
                <Clock className="w-4 h-4" />
                6:32 PM local time
              </div>
            </div>

            <div className="flex items-center justify-start gap-3 mt-3">
              <button className="flex items-center justify-center gap-1 border border-[#cccccc] rounded-lg text-gray-800 w-[85%] py-0.5 hover:bg-[#F8F8F8]">
                <MessageCircle className="w-[18px] h-[18px] rotate-y-180" />
                <h4 className="text-lg">Messsage</h4>
              </button>
              <button className="flex items-center justify-center gap-1 border border-[#cccccc] rounded-lg text-gray-800 px-2 py-1.5 hover:bg-[#F8F8F8]">
                <EllipsisVertical className="w-5 h-5 text-lg" />
              </button>
            </div>

            <div className="contact mt-5">
              <h4 className="text-md font-semibold">Contact information</h4>

              <div className="flex items-start justify-start gap-3 mt-2">
                <div className="px-2 py-1.5 bg-[#F6F6F6] rounded-md">
                  <Mail className="text-gray-800 w-[18px] h-[18px]" />
                </div>
                <div className="flex flex-col items-start justify-start">
                  <h4 className="text-gray-800 text-sm">Email Address</h4>
                  <h4 className="text-[#1264A3] hover:underline">tanveer@gmail.com</h4>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
export default DM;
