import React from "react";
import ChannelNav from "./ChannelNav";
import Message from "./Message";

const Channel = () => {
  return (
    <>
      <div className="w-full h-full flex flex-col">
        <ChannelNav />

        {/* Tab Content */}
        <div className="w-full h-[86.1%] relative">
          <div className="absolute inset-0 z-0 bg-white bg-[radial-gradient(100%_50%_at_50%_0%,rgba(0,163,255,0.13)_0%,rgba(0,163,255,0)_50%,rgba(0,163,255,0)_100%)]"></div>

          <div className="relative z-10 h-full">
            <Message />
          </div>
        </div>
      </div>
    </>
  );
};

export default Channel;
