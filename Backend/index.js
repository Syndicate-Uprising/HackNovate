const express = require('express');
const { createServer } = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const { Server } = require('socket.io');
require('dotenv').config();

const authRoutes = require('./routes/userroutes');
const roomRoutes = require('./routes/roomroutes');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_PATH || 'http://localhost:3000', // Ensure this matches your client URL
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  },
});

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);

io.on('connection', (socket) => {
  // console.log('New client connected');

  socket.on('joinRoom', (room) => {
    socket.join(room);
    // console.log(`User joined room: ${room}`);
    io.to(room).emit('userJoined', `A new user has joined the room: ${room}`);
  });

  socket.on('message', (message) => {
    // console.log('Message received:', message);
    io.to(message.room).emit('message', message);
  });

  socket.on('disconnect', () => {
    // console.log('Client disconnected');
    return;
  });
});

mongoose.connect(process.env.MONGODB_PATH, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  // console.log('Connected to MongoDB');
}).catch(err => console.log('MongoDB connection error:', err));

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
