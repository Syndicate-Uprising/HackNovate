import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:3000'; // Ensure this matches your server URL

const socket = io(SOCKET_URL, {
  transports: ['websocket'], // Use WebSocket for transport
  reconnectionAttempts: 5 // Optional: Set number of reconnection attempts
});

export default socket;
