/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import dynamic from "next/dynamic";
import "@excalidraw/excalidraw/index.css";
import { useCallback, useEffect, useRef, useState } from "react";
import { MainMenu, WelcomeScreen } from "@excalidraw/excalidraw";
import type { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types/types";
import { useGetFileData } from "app/hook/useGetFileData";
import { selectedWorkspaceId } from "@context/workspaceContext";
import { useSocketStore } from "@context/SocketContext";
import isEqual from "lodash/isEqual";
import { RingLoader } from "react-spinners";

// Dynamically import Excalidraw to disable SSR
const Excalidraw = dynamic(
  async () => (await import("@excalidraw/excalidraw")).Excalidraw,
  { ssr: false }
);

// Debounce utility
function debounce<T extends (...args: any[]) => void>(func: T, delay: number) {
  let timer: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func(...args);
    }, delay);
  };
}

const Canvas = () => {
  const excalidrawAPIRef = useRef<ExcalidrawImperativeAPI | null>(null);
  const lastSnapshotRef = useRef<string | null>(null);
  const [isInteracting, setIsInteracting] = useState(false);
  const [initialElements, setInitialElements] = useState<any[]>([]);
  const [pendingElements, setPendingElements] = useState<any[] | null>(null);
  const [isDataLoaded, setIsDataLoaded] = useState(false); // Track if backend data is loaded

  const { getCanvasData } = useGetFileData();
  const workspaceId = selectedWorkspaceId();
  const socket = useSocketStore((state) => state.socket);
  const pathParts = window.location.pathname.split("/");
  const fileId = pathParts[4] ?? null;

  // Set workspaceId if not already set
  useEffect(() => {
    if (!workspaceId.value) {
      const pathParts = window.location.pathname.split("/");
      const id = pathParts[2] ?? null;
      workspaceId.set(id as string);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch canvas data from backend and set it into Excalidraw
  useEffect(() => {
    if (fileId && workspaceId.value) {
      getCanvasData(workspaceId.value, fileId)
        .then((data) => {
          const content = JSON.parse(data.data);
          if (content && Array.isArray(content)) {
            const activeElements = content.filter(
              (element: any) => !element.isDeleted
            );
            setInitialElements(activeElements);
          }
          setIsDataLoaded(true); // Mark data as loaded
        })
        .catch((error) => {
          console.error("Failed to fetch canvas data:", error);
          setIsDataLoaded(true); // Even if there's an error, proceed to initialize the canvas
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspaceId.value, fileId]);

  // Socket collaboration logic
  useEffect(() => {
    if (!socket || !fileId) return;

    socket.emit("join-canvas", fileId);

    socket.on("update-canvas-complete", (data) => {
      const incomingElements = data?.content;
      if (!incomingElements || !Array.isArray(incomingElements)) {
        return;
      }

      const activeIncomingElements = incomingElements.filter(
        (element: any) => !element.isDeleted
      );

      const currentElements =
        excalidrawAPIRef.current?.getSceneElements() || [];
      const activeCurrentElements = currentElements.filter(
        (element: any) => !element.isDeleted
      );

      if (!isEqual(activeCurrentElements, activeIncomingElements)) {
        if (excalidrawAPIRef.current) {
          excalidrawAPIRef.current.updateScene({
            elements: activeIncomingElements,
            appState: { viewBackgroundColor: "#ffffff" },
          });
          setInitialElements(activeIncomingElements);
        }
      }
    });

    // Process any pending elements once socket is available
    if (pendingElements) {
      socket.emit("update-canvas", { fileId, content: pendingElements });
      setPendingElements(null);
    }

    return () => {
      socket.off("update-canvas-complete");
    };
  }, [socket, fileId, pendingElements]);

  // Filter out deleted elements and emit updates
  const addCanvasData = useCallback(
    (elements: any[]) => {
      const activeElements = elements.filter(
        (element: any) => !element.isDeleted
      );
      const snapshotString = JSON.stringify(activeElements);

      if (snapshotString !== lastSnapshotRef.current) {
        lastSnapshotRef.current = snapshotString;
        if (socket) {
          socket.emit("update-canvas", { fileId, content: activeElements });
        } else {
          setPendingElements(activeElements);
        }
      }
    },
    [socket, fileId]
  );

  // Debounced version of addCanvasData (500ms delay)
  const debouncedAddCanvasData = useRef(debounce(addCanvasData, 500));

  // Handle canvas changes
  const handleChange = useCallback(
    (elements: any[], appState: any) => {
      const isPanning = appState?.isPanning || false;
      const isZooming = appState?.isZooming || false;

      if (isPanning || isZooming) {
        return;
      }

      if (!isInteracting) {
        debouncedAddCanvasData.current(elements);
      }
    },
    [isInteracting]
  );

  const handlePointerDown = useCallback(() => {
    setIsInteracting(true);
  }, []);

  const handlePointerUp = useCallback(() => {
    setIsInteracting(false);
    if (!excalidrawAPIRef.current) {
      return;
    }
    const elements = excalidrawAPIRef.current.getSceneElements();
    if (elements) {
      debouncedAddCanvasData.current(elements);
    }
  }, []);

  // Show loader until data is loaded
  if (!isDataLoaded) {
    return (
      <div className="w-full h-screen flex items-center justify-center text-black">
        <div className="flex flex-col items-center justify-center h-32">
          <RingLoader color="#007A5A" size={40} />
          <p className="text-gray-500 mt-2 text-xl">Loading canvas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen text-black">
      <div
        className="w-full h-full"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
      >
        <Excalidraw
          excalidrawAPI={(api) => {
            excalidrawAPIRef.current = api;
          }}
          theme="light"
          onChange={(elements, appState) => handleChange(elements, appState)}
          initialData={{
            elements: initialElements,
            appState: { viewBackgroundColor: "#ffffff" },
          }}
          UIOptions={{
            canvasActions: {
              saveToActiveFile: false,
              loadScene: false,
              export: false,
              toggleTheme: false,
            },
          }}
        >
          <MainMenu>
            <MainMenu.DefaultItems.ClearCanvas />
            <MainMenu.DefaultItems.Export />
            <MainMenu.DefaultItems.ChangeCanvasBackground />
            <MainMenu.DefaultItems.SaveAsImage />
          </MainMenu>
          <WelcomeScreen>
            <WelcomeScreen.Hints.MenuHint />
            <WelcomeScreen.Hints.HelpHint />
            <WelcomeScreen.Hints.ToolbarHint />
            <WelcomeScreen.Center>
              <WelcomeScreen.Center.Heading>
                Start Drawing!
              </WelcomeScreen.Center.Heading>
            </WelcomeScreen.Center>
          </WelcomeScreen>
        </Excalidraw>
      </div>
    </div>
  );
};

export default Canvas;
