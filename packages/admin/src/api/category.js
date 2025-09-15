// src/api/category.js
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const categoryAPI = {
    // Get all categories with subcategories
    getAllCategories: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/categories`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching categories:', error);
            throw error;
        }
    },

    // Get single category by slug
    getCategoryBySlug: async (slug) => {
        try {
            const response = await fetch(`${API_BASE_URL}/categories/${slug}`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching category:', error);
            throw error;
        }
    },

    // Get subcategories by category ID
    getSubcategoriesByCategory: async (categoryId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/categories/${categoryId}/subcategories`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching subcategories:', error);
            throw error;
        }
    }
};