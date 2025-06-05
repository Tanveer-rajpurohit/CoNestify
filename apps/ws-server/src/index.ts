

import express from "express"
import http from "http"
import cors from "cors"
import dotenv from "dotenv"
import { Server } from "socket.io"
import registerSocketHandlers from "./socket.js"
import * as mediasoup from "mediasoup"

type Worker = mediasoup.types.Worker
type Router = mediasoup.types.Router
type Producer = mediasoup.types.Producer
type Consumer = mediasoup.types.Consumer
type WebRtcTransport = mediasoup.types.WebRtcTransport
type RtpCapabilities = mediasoup.types.RtpCapabilities
type TransportListenIp = mediasoup.types.TransportListenIp
type RtpParameters = mediasoup.types.RtpParameters
type DtlsParameters = mediasoup.types.DtlsParameters

dotenv.config()

const app = express()
const server = http.createServer(app)

// Socket.io instance
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all or set your frontend URL
    methods: ["GET", "POST"],
  },
})

type Peer = {
  transports: Record<string, { transport: WebRtcTransport; forProducerId?: string }>
  producers: Producer[]
  consumers: Consumer[]
  username: string
}

type Room = {
  router: Router
  peers: Record<string, Peer>
}

let worker: Worker
const rooms: Record<string, Room> = {}

app.use(cors())
app.use(express.json())

io.on("connection", async (socket) => {
  registerSocketHandlers(socket, io)

  try {
    worker = await mediasoup.createWorker()
  } catch (error) {
    console.error("Error creating Mediasoup worker:", error)
    process.exit(1)
  }

  let currentRoomId: string | null = null

  // Helper function to clean up user from room
  const cleanupUserFromRoom = (socketId: string, roomId: string) => {
    if (!rooms[roomId]) return

    const peer = rooms[roomId].peers[socketId]
    if (!peer) return



    const { transports, producers, consumers } = peer

    // Close all producers
    producers.forEach((producer) => {
      producer.close()
    })

    // Close all consumers
    consumers.forEach((consumer) => {
      consumer.close()
    })

    // Close all transports
    Object.values(transports).forEach((entry) => {
      entry.transport.close()
    })

    // Remove peer from room
    delete rooms[roomId].peers[socketId]

    // Notify other users in the room
    socket.to(roomId).emit("userDisconnected", { socketId })

  }

  socket.on(
    "joinRoom",
    async (
      { roomId, username }: { roomId: string; username: string },
      callback: (rtpCapabilities: RtpCapabilities) => void,
    ) => {
      currentRoomId = roomId
      socket.data.username = username
      socket.join(roomId)

      if (!rooms[roomId]) {
        const router = await worker.createRouter({
          mediaCodecs: [
            {
              kind: "audio",
              mimeType: "audio/opus",
              clockRate: 48000,
              channels: 2,
            },
            {
              kind: "video",
              mimeType: "video/VP8",
              clockRate: 90000,
            },
          ],
        })
        rooms[roomId] = { router, peers: {} }
      }

      rooms[roomId].peers[socket.id] = {
        transports: {},
        producers: [],
        consumers: [],
        username,
      }

      callback(rooms[roomId].router.rtpCapabilities)

      socket.to(roomId).emit("userJoined", { socketId: socket.id, username })

      Object.entries(rooms[roomId].peers).forEach(([peerSocketId, peer]) => {
        if (peerSocketId === socket.id) return
        peer.producers.forEach((producer) => {
          socket.emit("newProducer", {
            producerId: producer.id,
            socketId: peerSocketId,
            username: peer.username,
          })
         
        })
      })
    },
  )

  // Add explicit leaveRoom handler
  socket.on("leaveRoom", () => {

    if (currentRoomId) {
      // Leave the socket room
      socket.leave(currentRoomId)

      // Clean up user from the room
      cleanupUserFromRoom(socket.id, currentRoomId)

      // Reset current room
      currentRoomId = null
    }
  })

  socket.on(
    "createTransport",
    async (
      { forProducerId }: { forProducerId?: string },
      callback: (
        response:
          | {
              id: string
              iceParameters: mediasoup.types.IceParameters
              iceCandidates: mediasoup.types.IceCandidate[]
              dtlsParameters: mediasoup.types.DtlsParameters
            }
          | { error: string },
      ) => void,
    ) => {
      try {
        if (!currentRoomId) throw new Error("Not in a room")

        const transport = await rooms[currentRoomId].router.createWebRtcTransport({
          listenIps: [{ ip: "127.0.0.1" } as TransportListenIp],
          enableUdp: true,
          enableTcp: true,
          preferUdp: true,
        })

        rooms[currentRoomId].peers[socket.id].transports[transport.id] = {
          transport,
          forProducerId,
        }
       

        callback({
          id: transport.id,
          iceParameters: transport.iceParameters,
          iceCandidates: transport.iceCandidates,
          dtlsParameters: transport.dtlsParameters,
        })
      } catch (error: any) {
        console.error("Error creating transport:", error)
        callback({ error: error.message })
      }
    },
  )

  socket.on(
    "connectTransport",
    async (
      { transportId, dtlsParameters }: { transportId: string; dtlsParameters: DtlsParameters },
      callback: (error?: Error) => void,
    ) => {
      try {
        if (!currentRoomId) throw new Error("Not in a room")

        const transportEntry = rooms[currentRoomId].peers[socket.id].transports[transportId]
        if (!transportEntry) {
          return callback(new Error("Transport not found"))
        }
        await transportEntry.transport.connect({ dtlsParameters })
      
        callback()
      } catch (error: any) {
        console.error("Error connecting transport:", error)
        callback(error)
      }
    },
  )

  socket.on(
    "produce",
    async (
      {
        transportId,
        kind,
        rtpParameters,
      }: {
        transportId: string
        kind: "audio" | "video"
        rtpParameters: RtpParameters
      },
      callback: (response: { id?: string; error?: string }) => void,
    ) => {
      try {
        if (!currentRoomId) throw new Error("Not in a room")

        const transportEntry = rooms[currentRoomId].peers[socket.id].transports[transportId]
        if (!transportEntry) {
          console.error("Transport not found for producing:", transportId)
          return callback({ error: "Transport not found" })
        }

        const producer = await transportEntry.transport.produce({
          kind,
          rtpParameters,
        })
      

        rooms[currentRoomId].peers[socket.id].producers.push(producer)

        producer.on("transportclose", () => {
          //console.log("Producer closed")
        })

        callback({ id: producer.id })

        socket.to(currentRoomId).emit("newProducer", {
          producerId: producer.id,
          socketId: socket.id,
          username: socket.data.username,
        })
        
      } catch (error: any) {
        console.error("Error producing media:", error)
        callback({ error: error.message })
      }
    },
  )

  socket.on(
    "consume",
    async (
      { producerId, rtpCapabilities }: { producerId: string; rtpCapabilities: RtpCapabilities },
      callback: (
        response:
          | {
              id: string
              kind: string
              rtpParameters: RtpParameters
              producerId: string
            }
          | { error: string },
      ) => void,
    ) => {
      if (!currentRoomId) return callback({ error: "Not in a room" })

      const router = rooms[currentRoomId].router
     
      if (!router.canConsume({ producerId, rtpCapabilities })) {
        console.error("Router cannot consume producer:", producerId)
        return callback({ error: "Cannot consume" })
      }

      const transportEntry = Object.values(rooms[currentRoomId].peers[socket.id].transports).find(
        (entry) => entry.forProducerId === producerId,
      )
      if (!transportEntry) {
        console.error(`No transport found for consuming producer ${producerId}`)
        return callback({
          error: "No transport available for this producer",
        })
      }

      try {
        const consumer = await transportEntry.transport.consume({
          producerId,
          rtpCapabilities,
          paused: false,
        })
        
        rooms[currentRoomId].peers[socket.id].consumers.push(consumer)
        callback({
          id: consumer.id,
          kind: consumer.kind,
          rtpParameters: consumer.rtpParameters,
          producerId,
        })
      } catch (error: any) {
        console.error("Error creating consumer:", error)
        callback({ error: error.message })
      }
    },
  )

  socket.on("toggleMedia", ({ kind, enabled }: { kind: "audio" | "video"; enabled: boolean }) => {
   
    if (currentRoomId) {
      socket.to(currentRoomId).emit("mediaToggled", { socketId: socket.id, kind, enabled })
    }
  })

  socket.on("disconnect", () => {
   
    if (currentRoomId) {
      cleanupUserFromRoom(socket.id, currentRoomId)
    }
  })
})

const PORT = process.env.PORT || 8000
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
})
