const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { auth } = require('../middleware/auth');
const upload = require('../middleware/upload');
const uploadKYC = require('../middleware/upLoadKYC');

const { 
    validateRegistration, 
    validateLogin, 
    validatePasswordReset, 
    validatePasswordChange,
    validateProfileUpdate,
    handleValidationErrors 
} = require('../middleware/validation');

// Authentication routes with validation
router.post('/register', validateRegistration, handleValidationErrors, authController.register);
router.post('/login', validateLogin, handleValidationErrors, authController.login);
router.post('/logout', authController.logout);

// Password management routes
router.post('/forgot-password', validatePasswordReset, handleValidationErrors, authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.post('/change-password', auth, validatePasswordChange, handleValidationErrors, authController.changePassword);

// User profile routes
router.get('/profile', auth, authController.getProfile);
router.put('/profile', auth, validateProfileUpdate, handleValidationErrors, authController.updateProfile);

router.post('/upload-photo', auth, upload.single('profilePhoto'), authController.uploadProfilePhoto);


router.post('/upload-kyc', auth, uploadKYC.single('document'), authController.uploadKYCDocument);


module.exports = router;