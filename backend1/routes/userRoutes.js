// routes/userRoutes.js
const userController = require('../controllers/userController');
const { auth } = require('../middleware/auth');
const express = require('express');
const router = express.Router();

// Add these routes
router.get('/profile-status', auth, userController.getProfileStatus);
router.put('/kyc-details', auth, userController.updateKYCDetails);

module.exports = router;
