// page.jsx
"use client";
import { Tldraw } from "@tldraw/tldraw";
import "@tldraw/tldraw/tldraw.css"; // very important!

const Page = () => {
  return (
    <div className="w-full h-screen">
      <Tldraw />
    </div>
  );
};

export default Page;
