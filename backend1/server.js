// app.js (or server.js)
const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:3001", "http://localhost:3002"],
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors({
    origin: function (origin, callback) {
        const allowedOrigins = [
            'http://localhost:3000', // Main app
            'http://localhost:3001', // Admin app
            'http://localhost:3002'  // User app
        ];
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

app.use(express.json());

// Database connection & sync
const db = require('./models');
const { Sequelize } = require('sequelize');

// Function to create database if it doesn't exist
async function initializeDatabase() {
    try {
        // First, connect to default postgres database to create our database if it doesn't exist
        const tempSequelize = new Sequelize('postgres', process.env.DB_USER || 'postgres', process.env.DB_PASSWORD || 'your_password', {
            host: process.env.DB_HOST || 'localhost',
            dialect: 'postgres'
        });

        // Check if our database exists, if not create it
        try {
            await tempSequelize.query(`CREATE DATABASE "${process.env.DB_NAME || 'rbac_db'}"`);
            console.log('Database created successfully');
        } catch (err) {
            if (err.message.includes('already exists')) {
                console.log('Database already exists');
            } else {
                throw err;
            }
        }

        await tempSequelize.close();

        await db.sequelize.sync({ force: false }); 
        console.log('Database synced successfully');
    } catch (err) {
        console.log('Failed to initialize database: ' + err.message);
        process.exit(1);
    }
}

app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Define Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/data', require('./routes/admin'));
app.use('/api/data', require('./routes/userRoutes'));
app.use('/api', require('./routes/categoryRoutes'));
app.use('/api', require('./routes/propertyRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join user to their personal room
  socket.on('join-user-room', (userId) => {
    socket.join(`user-${userId}`);
    console.log(`User ${userId} joined room: user-${userId}`);
  });

  // Handle new message
  socket.on('new-message', (messageData) => {
    // Broadcast to receiver's room
    socket.to(`user-${messageData.receiverId}`).emit('message-received', messageData);
    console.log(`Message sent from ${messageData.senderId} to ${messageData.receiverId}`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Make io available to routes
app.set('io', io);

// Initialize database and start server
initializeDatabase().then(() => {
    const PORT =  5000;
    server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
});