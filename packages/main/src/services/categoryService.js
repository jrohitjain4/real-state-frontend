/**
 * Simple Category Service
 * Basic category API calls
 */

import apiService from './apiService';
import API_CONFIG from '../config/api';

class CategoryService {
  // Get all categories
  async getAllCategories() {
    return apiService.get(API_CONFIG.ENDPOINTS.CATEGORIES);
  }

  // Get category by ID
  async getCategoryById(categoryId) {
    return apiService.get(API_CONFIG.ENDPOINTS.CATEGORY_BY_ID, { id: categoryId });
  }

  // Get subcategories by category
  async getSubcategoriesByCategory(categoryId) {
    return apiService.get(API_CONFIG.ENDPOINTS.SUBCATEGORIES, { id: categoryId });
  }

  // Get categories for navigation
  async getCategoriesForNavigation() {
    try {
      const data = await this.getAllCategories();
      
      if (data.success && data.data) {
        return {
          success: true,
          data: data.data.map(category => ({
            id: category.id,
            name: category.name,
            slug: category.slug,
            subcategories: category.subcategories || []
          }))
        };
      }
      
      return { success: false, data: [] };
    } catch (error) {
      console.error('Error fetching categories for navigation:', error);
      return { success: false, data: [], error: error.message };
    }
  }

  // Get property types by category
  async getPropertyTypesByCategory(categoryId) {
    try {
      const subcategories = await this.getSubcategoriesByCategory(categoryId);
      
      if (subcategories.success && subcategories.data) {
        // Group subcategories by property type
        const propertyTypes = {};
        
        subcategories.data.forEach(subcategory => {
          const type = subcategory.propertyType || 'other';
          if (!propertyTypes[type]) {
            propertyTypes[type] = [];
          }
          propertyTypes[type].push(subcategory);
        });
        
        return {
          success: true,
          data: propertyTypes
        };
      }
      
      return { success: false, data: {} };
    } catch (error) {
      console.error('Error fetching property types:', error);
      return { success: false, data: {}, error: error.message };
    }
  }
}

// Create and export instance
const categoryService = new CategoryService();
export default categoryService;
