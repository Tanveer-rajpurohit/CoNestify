import { Server } from "socket.io";
import { prisma } from "@repo/db";

function getRoomId(userId1: string, userId2: string) {
  return [userId1, userId2].sort().join("*");
}

export default function registerSocketHandlers(io: Server) {
  io.on("connection", (socket) => {
    console.log(`⚡️ [socket] connected: ${socket.id}`);

    socket.emit("connected", socket.id);

    socket.on("join-channel", (data) => {
      const channelId = typeof data === "string" ? data : data?.channelId;
      if (channelId) {
        socket.join(channelId);
      }
    });

    socket.on("channel-sendMessage", async (data) => {
      const {
        message,
        workspaceId,
        channelId,
        userId,
        type,
        canvasId,
        docId,
        listId,
      } = data;

      const messageData = await prisma.message.create({
        data: {
          content: message,
          workspaceId,
          channelId,
          senderId: userId,
          type,
          canvasId,
          docId,
          listId,
        },
        include: {
          sender: {
            select: { id: true, name: true, image: true, email: true },
          },
          canvas: { select: { id: true, title: true } },
          list: { select: { id: true, title: true } },
          doc: { select: { id: true, title: true } },
        },
      });

      io.to(channelId).emit("channel-newMessage", messageData);
    });

    socket.on("join-dm", (data) => {
      const { userId, receiverId } = data;

      const roomId = getRoomId(userId, receiverId);
      if (roomId) {
        socket.join(roomId);
      }
    });

    socket.on("DM-sendMessage", async (data) => {
      const {
        message,
        workspaceId,
        receiverId,
        userId,
        type,
        canvasId,
        docId,
        listId,
      } = data;

      const messageData = await prisma.message.create({
        data: {
          content: message,
          workspaceId,
          receiverId: receiverId,
          senderId: userId,
          type,
          canvasId,
          docId,
          listId,
        },
        include: {
          sender: {
            select: { id: true, name: true, image: true, email: true },
          },
          canvas: { select: { id: true, title: true } },
          list: { select: { id: true, title: true } },
          doc: { select: { id: true, title: true } },
        },
      });

      const roomId = getRoomId(userId, receiverId);

      io.to(roomId).emit("DM-newMessage", messageData);
    });

    socket.on("disconnect", () => {
      console.log(`❌ Disconnected: ${socket.id}`);
    });
  });
}
