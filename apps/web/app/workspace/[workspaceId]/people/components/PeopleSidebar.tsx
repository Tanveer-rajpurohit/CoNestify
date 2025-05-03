"use client";

import { UserRound } from "lucide-react";

const PeopleSidebar = () => {


    const DocsTypeData = [
        { name: "All People", icon: <UserRound className="w-4 h-4" /> },
    ];

    return (
        <>
            <div className="h-full w-[21.8rem] bg-[#cfcac377] rounded-tl-md rounded-bl-md">
                <div className="w-full px-4 py-3 text-white border-b border-[#cfcac377]">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center justify-start gap-1 px-1.5 py-0.5 hover:bg-[#f4f1f145] backdrop-blur-2xl rounded-md">
                            <h1 className="text-xl ">People</h1>
                        </div>
                    </div>
                </div>

                <div className="w-full pb-2 px-3 text-[#f1f1f1]">
                    {/* Channels */}
                    <div className="channels mt-2">
                        <div className="flex items-start justify-center text-md flex-col ">
                            {DocsTypeData.map((Docs, idx) => {
                                return (
                                    <div
                                        key={idx}
                                        className={`w-full px-3 py-0.5 flex items-center justify-start gap-2.5 rounded-md cursor-pointer bg-white text-[#171717]
                                        `}
                                    >
                                        {Docs.icon}
                                        <h1 className="text-md font-medium">{Docs.name}</h1>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PeopleSidebar;
