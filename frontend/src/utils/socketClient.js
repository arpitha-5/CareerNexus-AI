import { io } from 'socket.io-client';

let socket = null;

export const connectSocket = (token) => {
  if (socket?.connected) {
    return socket;
  }

  socket = io(import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000', {
    auth: {
      token,
    },
    transports: ['websocket', 'polling'],
  });

  socket.on('connect', () => {
    console.log('Socket connected');
    socket.emit('join-forum');
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected');
  });

  socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error);
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.emit('leave-forum');
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = () => socket;

