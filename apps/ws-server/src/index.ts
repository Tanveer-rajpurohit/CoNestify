import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import registerSocketHandlers from './socket.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

// Socket.io instance
const io = new Server(server, {
  cors: {
    origin: '*', // Allow all or set your frontend URL
    methods: ['GET', 'POST'],
  },
});

app.use(cors());
app.use(express.json());

registerSocketHandlers(io);


const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
