const jwt = require('jsonwebtoken');
const db = require('../models');
const User = db.User;

// Middleware to verify JWT token
const auth = async (req, res, next) => {
    try {
        let token = req.header('x-auth-token');
        
        // Also check Authorization header for Bearer token
        if (!token) {
            const authHeader = req.header('Authorization');
            if (authHeader && authHeader.startsWith('Bearer ')) {
                token = authHeader.substring(7); // Remove 'Bearer ' prefix
            }
        }
        
        if (!token) {
            return res.status(401).json({ msg: 'No token, authorization denied' });
        }

        // Verify token with the same secret used in authController
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_super_secret_jwt_key_here_change_in_production');
        

        console.log('Auth middleware - Decoded token:', decoded);

        // Get user from database
        const user = await User.findByPk(decoded.user.id);
        if (!user) {
            return res.status(401).json({ msg: 'Token is not valid' });
        }
        console.log('Auth middleware - User found:', user.email);
        
        req.user = user;
        next();
    } catch (err) {
        console.error('JWT verification error:', err.message);
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

// Middleware to check if user is admin
const admin = async (req, res, next) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ msg: 'Access denied. Admin role required.' });
        }
        next();
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
};

module.exports = { auth, admin };