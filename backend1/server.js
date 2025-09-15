// app.js (or server.js)
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const path = require('path');

const app = express();

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

// Initialize database and start server
initializeDatabase().then(() => {
    const PORT =  5000;
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
});