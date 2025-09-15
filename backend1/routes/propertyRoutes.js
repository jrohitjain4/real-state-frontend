// routes/propertyRoutes.js
const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/propertyController');
const { auth, admin } = require('../middleware/auth');
const uploadProperty = require('../middleware/uploadProperty');

// Public routes
router.get('/properties', propertyController.getAllProperties);
router.get('/properties/:slug', propertyController.getPropertyBySlug);
router.get('/properties/:id/similar', propertyController.getSimilarProperties);

// Protected routes
router.post('/properties', auth, propertyController.createProperty);
router.get('/my-properties', auth, propertyController.getMyProperties);
router.put('/properties/:id', auth, propertyController.updateProperty);
router.delete('/properties/:id', auth, propertyController.deleteProperty);

// Image management
router.post('/properties/:propertyId/images', 
    auth, 
    uploadProperty.array('images', 10), 
    propertyController.uploadPropertyImages
);
router.delete('/property-images/:imageId', auth, propertyController.deletePropertyImage);

// Admin routes
router.patch('/properties/:id/status', auth, admin, propertyController.updatePropertyStatus);

module.exports = router;