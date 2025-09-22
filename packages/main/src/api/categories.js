// API service for categories and subcategories
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const categoriesAPI = {
  // Fetch all categories with their subcategories
  getAllCategories: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch categories');
      }

      return data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  // Fetch subcategories by category ID
  getSubcategoriesByCategory: async (categoryId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories/${categoryId}/subcategories`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch subcategories');
      }

      return data;
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      throw error;
    }
  },

  // Get category by slug
  getCategoryBySlug: async (slug) => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories/${slug}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch category');
      }

      return data;
    } catch (error) {
      console.error('Error fetching category:', error);
      throw error;
    }
  }
};

