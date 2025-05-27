"use client";

import React, { useEffect } from "react";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Checklist from "@editorjs/checklist";
import Table from "@editorjs/table";
import Quote from "@editorjs/quote";
import Marker from "@editorjs/marker";
import Delimiter from "@editorjs/delimiter";
import InlineCode from "@editorjs/inline-code";
import LinkTool from "@editorjs/link";
import Embed from "@editorjs/embed";
import ImageTool from "@editorjs/image";
import CodeTool from "@editorjs/code";
import "./editorjs-custom.css";

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
};

const EditorPage = () => {
  const ref = React.useRef<EditorJS | null>(null) as React.MutableRefObject<EditorJS | null>;

  useEffect(() => {
    initEditor();
  }, []);

  const initEditor = () => {
    const editor = new EditorJS({
      holder: "editorjs",
      autofocus: true,
      placeholder: "Start writing your story...",
      tools: {
        header: {
          class: Header,
          inlineToolbar: true,
          config: {
            levels: [1, 2, 3, 4],
            defaultLevel: 2,
          },
        },
        list: {
          class: List,
          inlineToolbar: true,
        },
        checklist: Checklist,
        table: Table,
        quote: {
          class: Quote,
          inlineToolbar: true,
        },
        marker: Marker,
        delimiter: Delimiter,
        inlineCode: InlineCode,
        linkTool: {
          class: LinkTool,
          config: {
            endpoint: "http://localhost:8008/fetchUrl", // You can replace this
          },
        },
        embed: Embed,
        image: {
          class: ImageTool,
          config: {
            endpoints: {
              byFile: "http://localhost:8008/uploadFile", // mock or setup your API
              byUrl: "http://localhost:8008/fetchUrl",
            },
          },
        },
        code: CodeTool,
      },
      data: rawDocument,

      onReady: () => {
        console.log("Editor.js is ready!");
      },
      onChange: async () => {
        const content = await editor.save();
        console.log("Updated Content:", content);
      },
    });
    ref.current = editor;

    return () =>{
      if (ref.current) {
        ref.current.destroy();
      }
      ref.current = null;
      const holder = document.getElementById("editorjs");
      if (holder) holder.innerHTML = "";
    }
  };

  return (
    <div className="w-screen h-screen bg-gray-100 flex items-center justify-center ">
      <div className="bg-white w-full h-full overflow-y-auto p-8 rounded shadow-md prose">
        <div id="editorjs" />
      </div>
    </div>
  );
};

export default EditorPage;
