import { io, Socket } from "socket.io-client";
import { create } from "zustand";

type SocketState = {
  socket: Socket | null;
  connect: () => void;
  disconnect: () => void;
};

export const useSocketStore = create<SocketState>((set, get) => ({
  socket: null,
  connect: () => {
    if (!get().socket) {
      const socketInstance = io("ws://localhost:8000");
      socketInstance.on("connect", () => {
        console.log("Socket connected:", socketInstance.id);
      });
      set({ socket: socketInstance });
    }
  },
  disconnect: () => {
    get().socket?.disconnect();
    set({ socket: null });
  },
}));