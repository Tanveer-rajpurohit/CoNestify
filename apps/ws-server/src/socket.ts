import { Server, Socket } from "socket.io";
import { prisma } from "@repo/db";

function getRoomId(userId1: string, userId2: string) {
  return [userId1, userId2].sort().join("*");
}

export default function registerSocketHandlers(socket: Socket, io: Server) {

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

    //docs

    socket.on("join-docs", (fileId: string) => {
      if (fileId) {
        socket.join(fileId);
      }
    });

    socket.on("update-docs", async (data) => {
      const { fileId, content } = data;

      await prisma.doc.update({
        where: { id: fileId },
        data: {
          content: JSON.stringify(content),
        },
      });

      socket.to(fileId).emit("update-docs-complete", {
        content,
      });
    });


    //list
    socket.on("join-list", (fileId: string) => {
      if (fileId) {
        socket.join(fileId);
      }
    });

    socket.on("update-list", async (data) => {
      const { fileId, items } = data;

      await prisma.list.update({
        where: { id: fileId },
        data: {
          items: JSON.stringify(items),
        },
      });

      socket.to(fileId).emit("update-list-complete", {
        items,
      });
    });

    //canvas
    socket.on("join-canvas", (fileId: string) => {
      if (fileId) {
        socket.join(fileId);
      }
    });

    socket.on("update-canvas", async (data) => {
      const { fileId, content } = data;

      await prisma.canvasDoc.update({
        where: { id: fileId },
        data: {
          data: JSON.stringify(content),
        },
      });

      socket.to(fileId).emit("update-canvas-complete", {
        content,
      });
    });





    socket.on("disconnect", () => {
      //console.log(`❌ Disconnected: ${socket.id}`);
    });

}
