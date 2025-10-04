// routes/propertyRoutes.js
const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/propertyController');
const { auth, admin } = require('../middleware/auth');
const uploadProperty = require('../middleware/uploadProperty');

// Public routes - Specific routes MUST come before parameterized routes
router.get('/properties/counts', propertyController.getPropertyCounts);
router.get('/properties/count-by-subcategory', propertyController.getPropertyCountBySubcategoryName);
router.get('/properties/count-by-city', propertyController.getPropertyCountByCity);
router.get('/properties', propertyController.getAllProperties);

// Protected routes
router.post('/properties', auth, propertyController.createProperty);
router.get('/my-properties', auth, propertyController.getMyProperties);

// Property access routes - order matters!
// Similar properties route (before :slug to avoid conflict)
router.get('/properties/:id/similar', propertyController.getSimilarProperties);

// First: Public slug-based access (for property detail pages)
router.get('/properties/:slug', propertyController.getPropertyBySlug);

// Second: Protected ID-based access (for editing)
router.get('/properties/:id', auth, propertyController.getPropertyById);
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