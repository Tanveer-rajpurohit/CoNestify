"use client";
import React from "react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  FileText,
  MoreHorizontal,
  ListTodo,
  Layers,
  Users,
} from "lucide-react";
import { useTransition } from "react";

import { IoDocumentOutline } from "react-icons/io5";
import { useSidebarSelectionTab } from "@context/SidebarSeletion";
import { useRouter, usePathname } from "next/navigation";

const menuItems = [
  { key: "home", icon: <Home className="w-5 h-5" />, label: "Home" },
  { key: "canvas", icon: <FileText className="w-5 h-5" />, label: "Canvas" },
  { key: "files", icon: <Layers className="w-5 h-5" />, label: "Files" },
  { key: "more", icon: <MoreHorizontal className="w-5 h-5" />, label: "More" },
];

const moreItems = [
  {
    title: "Docs",
    desc: "create and find docs file",
    icon: <IoDocumentOutline />,
  },
  {
    title: "Lists",
    desc: "Track and manage projects",
    icon: <ListTodo className="w-5 h-5" />,
  },
  {
    title: "People",
    desc: "Your team and user groups",
    icon: <Users className="w-5 h-5" />,
  },
];

const SideNav = () => {
  const router = useRouter();
  const pathname = usePathname();

  const selectedSidebarType = useSidebarSelectionTab((state) => state.value);
  const setSelectedSidebarType = useSidebarSelectionTab((state) => state.set);

  // const [selectedSidebarType, setSelectedSidebarType] = useState("home");
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const moreMenuRef = useRef<HTMLDivElement>(null);
  const moreButtonRef = useRef<HTMLDivElement>(null);
  const createButtonRef = useRef<HTMLDivElement>(null);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const parts = pathname.split("/");

    const workspaceId = parts[2];

    menuItems.forEach((item) => {
      router.prefetch(`/workspace/${workspaceId}/${item.key}`);
    });
    const currentTab = parts[3] || "home";

    if (currentTab !== selectedSidebarType) {
      setSelectedSidebarType(currentTab);
    }
  }, [router, pathname, selectedSidebarType, setSelectedSidebarType]);

  const handleClick = (key: string) => {
    if (key === "more") {
      setIsMoreOpen(!isMoreOpen);
    } else {
      startTransition(() => {
        setSelectedSidebarType(key);
        setIsMoreOpen(false);

        const parts = pathname.split("/");
        const workspaceId = parts[2];

        router.push(`/workspace/${workspaceId}/${key.toLowerCase()}`);
      });
    }
  };



  // Close more menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        moreMenuRef.current &&
        !moreMenuRef.current.contains(target) &&
        moreButtonRef.current &&
        !moreButtonRef.current.contains(target) &&
        createButtonRef.current &&
        !createButtonRef.current.contains(target)
      ) {
        setIsMoreOpen(false);
        setIsMoreOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="h-full w-[4.3rem]  bg-[#A69E97] py-4 px-2 flex flex-col justify-between relative">
      {/* Top Section */}
      <div className="flex flex-col items-center gap-5">
        {/* Top Initial Circle */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-8 h-8 rounded-md bg-[#7E6B7A] text-white font-bold text-sm flex items-center justify-center cursor-pointer"
        >
          T
        </motion.div>

        {/* Main Icons */}
        <div className="flex flex-col items-center gap-5">
          {menuItems.map((item) => (
            <div
              ref={moreButtonRef}
              key={item.key}
              onClick={() => handleClick(item.key)}
              className={`relative flex flex-col items-center gap-1 cursor-pointer w-full`}
            >
              <div className="flex flex-col items-center text-white">
                {selectedSidebarType === item.key ? (
                  <div className="bg-[#5D3E5D] rounded-md p-2 flex items-center justify-center">
                    {item.icon}
                  </div>
                ) : (
                  <div>{item.icon}</div>
                )}
                <span className="text-sm mt-1">{item.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

   

      {/* More Menu Popup */}
      <AnimatePresence>
        {isMoreOpen && (
          <motion.div
            ref={moreMenuRef}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="absolute left-16 top-[59.6%] -translate-y-1/2 w-[22.1rem] bg-white rounded-xl shadow-2xl  z-50"
          >
            <div className="border-b-[0.1px] border-[#c1bdbd] px-3 py-3 ">
              <h2 className="text-xl  text-black px-2 ">More</h2>
            </div>
            <div>
              {moreItems.map((item, index) => (
                <motion.div
                  key={item.title}
                  onClick={() => handleClick(item.title)}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  whileHover={{
                    backgroundColor: "#f9f9f9",
                  }}
                  className={`flex items-start gap-3 px-3 py-2.5  transition cursor-pointer`}
                >
                  <div className="bg-[#F9EDFF] text-[#2E052E] rounded-xl p-2.5 flex items-center justify-center min-w-[40px] min-h-[40px]">
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-1">
                      <p className="text-md font-semibold text-[#333133]">
                        {item.title}
                      </p>
                    </div>
                    <p className="text-sm text-gray-800 ">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SideNav;
