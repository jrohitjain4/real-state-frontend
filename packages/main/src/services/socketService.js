import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
  }

  connect(userId) {
    if (this.socket && this.isConnected) {
      console.log('Socket already connected, reusing connection');
      return this.socket;
    }
    
    if (this.socket) {
      console.log('Disconnecting existing socket before reconnecting');
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }

    console.log('Creating new socket connection for user:', userId);
    this.socket = io('http://localhost:5000', {
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 3,
      reconnectionDelay: 1000
    });

    this.socket.on('connect', () => {
      console.log('Socket connected successfully:', this.socket.id);
      this.isConnected = true;
      
      // Join user's personal room
      this.socket.emit('join-user-room', userId);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      this.isConnected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      this.isConnected = false;
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  onMessageReceived(callback) {
    if (this.socket) {
      this.socket.on('message-received', callback);
    }
  }

  offMessageReceived(callback) {
    if (this.socket) {
      this.socket.off('message-received', callback);
    }
  }

  emitNewMessage(messageData) {
    if (this.socket && this.isConnected) {
      this.socket.emit('new-message', messageData);
    }
  }
}

export default new SocketService();
