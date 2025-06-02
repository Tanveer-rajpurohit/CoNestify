"use client";
import { useEffect } from "react";
import { useSocketStore } from "@context/SocketContext";

export default function SocketInitializer() {
  const connect = useSocketStore((state) => state.connect);

  useEffect(() => {
    connect();
    // Optionally: return () => useSocketStore.getState().disconnect();
  }, [connect]);

  return null; // This component does not render anything
}
