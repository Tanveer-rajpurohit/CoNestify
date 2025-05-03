import React from "react";
import { Brush, FileText, ListTodo } from "lucide-react";
import { JSX } from "react/jsx-dev-runtime";


type FileType = "canvas" | "document" | "list";


export interface FileTypeMeta {
  icon: JSX.Element;
  bg: string;
}

export const fileTypeData: Record<FileType, FileTypeMeta> = {
    canvas: {
      icon: <Brush className="w-4 h-4 text-white" />,
      bg: "bg-[#1CB6EB]",
    },
    document: {
      icon: <FileText className="w-4 h-4 text-white" />,
      bg: "bg-[#E19B06]",
    },
    list: {
      icon: <ListTodo className="w-4 h-4 text-white" />,
      bg: "bg-[#7D7DE3]",
    },
  }