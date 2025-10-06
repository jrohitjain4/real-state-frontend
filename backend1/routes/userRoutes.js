// routes/userRoutes.js
const userController = require('../controllers/userController');
const { auth } = require('../middleware/auth');
const upload = require('../middleware/upload');
const express = require('express');
const router = express.Router();

// Profile routes
router.get('/profile-status', auth, userController.getProfileStatus);
router.get('/profile', auth, userController.getUserProfile);
router.put('/profile', auth, userController.updateUserProfile);
router.post('/profile/photo', auth, upload.single('profilePhoto'), userController.uploadProfilePhoto);
router.put('/kyc-details', auth, userController.updateKYCDetails);

module.exports = router;
