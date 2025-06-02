import { Server, Socket } from 'socket.io';

export default function registerSocketHandlers(io: Server) {
  io.on('connection', (socket) => {
  console.log(`⚡️ [socket] connected: ${socket.id}`);

    socket.on('message', (msg) => {
    console.log(`📨 Received message from ${socket.id}:`, msg);
    
    // Broadcast to other clients
    socket.broadcast.emit('message', msg);
  });

  socket.on('disconnect', () => {
    console.log(`❌ Disconnected: ${socket.id}`);
  });
});
}


