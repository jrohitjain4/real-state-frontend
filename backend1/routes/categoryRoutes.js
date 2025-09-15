// routes/categoryRoutes.js
const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { auth, admin } = require('../middleware/auth');

// Public routes
router.get('/categories', categoryController.getAllCategories);
router.get('/categories/:slug', categoryController.getCategoryBySlug);
router.get('/categories/:categoryId/subcategories', categoryController.getSubcategoriesByCategory);

// Admin only routes
router.post('/categories', auth, admin, categoryController.createCategory);
router.put('/categories/:id', auth, admin, categoryController.updateCategory);
router.delete('/categories/:id', auth, admin, categoryController.deleteCategory);

router.post('/subcategories', auth, admin, categoryController.createSubcategory);

module.exports = router;