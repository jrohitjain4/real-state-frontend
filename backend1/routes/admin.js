const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { auth, admin } = require('../middleware/auth');

// Public route for user dashboard data
router.get('/user', auth, userController.getUserDashboardData);

// Admin-only routes for user management
router.get('/users', auth, admin, userController.getAllUsers);
router.get('/users/:id', auth, admin, userController.getUserById);
router.put('/users/:id', auth, admin, userController.updateUser);
router.delete('/users/:id', auth, admin, userController.deleteUser);

// Admin dashboard data
router.get('/admin', auth, admin, userController.getAdminDashboardData);

module.exports = router;