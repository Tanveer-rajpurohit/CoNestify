/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";

import React, { useEffect, useState } from "react";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
// @ts-ignore
import Checklist from "@editorjs/checklist";
import Table from "@editorjs/table";
import Quote from "@editorjs/quote";
// @ts-ignore
import Marker from "@editorjs/marker";
import Delimiter from "@editorjs/delimiter";
import InlineCode from "@editorjs/inline-code";
// @ts-ignore
import LinkTool from "@editorjs/link";
// @ts-ignore
import Embed from "@editorjs/embed";
import ImageTool from "@editorjs/image";
import CodeTool from "@editorjs/code";
import "./editorjs-custom.css";
import { useGetFileData } from "app/hook/useGetFileData";
import { selectedWorkspaceId } from "@context/workspaceContext";
import { useSocketStore } from "@context/SocketContext";
import isEqual from "lodash.isequal"; // install this package

const rawDocument = {
  time: new Date().getTime(),
  blocks: [
    {
      type: "header",
      data: {
        text: "Welcome to Your List & Table Demo!",
        level: 1,
      },
    },
    {
      type: "paragraph",
      data: {
        text: "Below are some example lists and tables to showcase Editor.js features.",
      },
    },
    {
      type: "list",
      data: {
        style: "ordered",
        items: ["First step", "Second step", "Third step"],
      },
    },
    {
      type: "list",
      data: {
        style: "unordered",
        items: ["Apple", "Banana", "Cherry"],
      },
    },
    {
      type: "table",
      data: {
        withHeadings: true,
        content: [
          ["Name", "Role", "Location"],
          ["Alice", "Developer", "NY"],
          ["Bob", "Designer", "SF"],
          ["Charlie", "Manager", "LA"],
        ],
      },
    },
    {
      type: "table",
      data: {
        withHeadings: false,
        content: [
          ["Task 1", "Done"],
          ["Task 2", "In Progress"],
          ["Task 3", "Pending"],
        ],
      },
    },
  ],
  version: "2.31.0-rc.7"
};

const EditorPage = () => {
  const ref = React.useRef<EditorJS | null>(null);
  const [editorData, setEditorData] = useState(rawDocument);
  const { getListData } = useGetFileData();
  const workspaceId = selectedWorkspaceId();
  const socket = useSocketStore((state) => state.socket);
  const pathParts = window.location.pathname.split("/");
  const fileId = pathParts[4] ?? null;

  useEffect(() => {
    if (!workspaceId.value) {
      const pathParts = window.location.pathname.split("/");
      const id = pathParts[2] ?? null;
      workspaceId.set(id as string);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load data from backend

  useEffect(() => {
    if (fileId && workspaceId.value) {
      getListData(workspaceId.value, fileId).then((data) => {
        const items = JSON.parse(data.items);
        if (items) {
          setEditorData({
            time: items.time,
            blocks: items.blocks,
            version: items.version,
          });
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspaceId.value, fileId]);

  // Join room and listen to updates when socket is ready
  useEffect(() => {
    if (!socket || !fileId) return;

    console.log("🔌 Socket is available in editor");
    socket.emit("join-list", fileId);

    socket.on("update-list-complete", (data) => {

      let incomingData = data?.items;
      if (!incomingData) return;

      if (typeof incomingData === "string") {
        try {
          incomingData = JSON.parse(incomingData);
        } catch (err) {
          console.error("❌ Failed to parse incoming content", err);
          return;
        }
      }

      const newContent = Array.isArray(incomingData)
        ? {
            time: new Date().getTime(),
            blocks: incomingData,
            version: "2.31.0-rc.7",
          }
        : {
            time: incomingData.time || new Date().getTime(),
            blocks: incomingData.blocks || [],
            version: incomingData.version || "2.31.0-rc.7",
          };

      const currentContent = ref.current ? ref.current.save() : null;

      // Compare before applying render
      Promise.resolve(currentContent).then((savedData) => {
        if (!isEqual(savedData?.blocks, newContent.blocks)) {
          if (ref.current) {
            ref.current.render(newContent);
          } else {
            setEditorData(newContent);
          }
        } else {
          console.log("⏩ Skipping render: no content change");
        }
      });
    });

    return () => {
      socket.off("update-list-complete");
    };
  }, [socket, fileId]);

  // Initialize EditorJS only when both editorData and socket are ready
  useEffect(() => {
    if (!socket || !editorData || !document.getElementById("editorjs")) return;

    const editor = new EditorJS({
      holder: "editorjs",
      autofocus: true,
      placeholder: "Start writing your story...",
      tools: {
        header: {
          // @ts-ignore
          class: Header,
          inlineToolbar: true,
          config: {
            levels: [1, 2, 3, 4],
            defaultLevel: 2,
          },
        },
          // @ts-ignore
        list: { class: List, inlineToolbar: true },
        checklist: Checklist,
        table: Table,
        quote: { class: Quote, inlineToolbar: true },
        marker: Marker,
        delimiter: Delimiter,
        inlineCode: InlineCode,
        linkTool: {
          class: LinkTool,
          config: {
            endpoint: "http://localhost:8008/fetchUrl",
          },
        },
        embed: Embed,
        image: {
          class: ImageTool,
          config: {
            endpoints: {
              byFile: "http://localhost:8008/uploadFile",
              byUrl: "http://localhost:8008/fetchUrl",
            },
          },
        },
        code: CodeTool,
      },
      data: editorData,

      onReady: () => {
        console.log("✅ Editor.js is ready!");
      },
      onChange: async () => {
        const items = await editor.save();
        if (!socket) {
          console.warn("⚠️ Socket not initialized at change");
          return;
        }
        socket.emit("update-list", { fileId, items });
      },
    });

    ref.current = editor;

    return () => {
      if (ref.current) {
        ref.current.destroy();
        ref.current = null;
      }
      const holder = document.getElementById("editorjs");
      if (holder) holder.innerHTML = "";
    };
  }, [editorData, socket, fileId]);

  return (
    <div className="w-screen h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white w-full h-full overflow-y-auto p-8 rounded shadow-md prose">
        <div id="editorjs" />
      </div>
    </div>
  );
};

export default EditorPage;
