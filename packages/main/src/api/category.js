/**
 * Category API - Complete category functions
 */

const BASE_URL = 'http://localhost:5000/api';

// Helper function to get URL
const getUrl = (endpoint, params = {}) => {
  let url = `${BASE_URL}${endpoint}`;
  Object.keys(params).forEach(key => {
    url = url.replace(`:${key}`, params[key]);
  });
  return url;
};

// Helper function to get headers
const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Get all categories
export const getAllCategories = async () => {
  const response = await fetch(getUrl('/categories'), {
    method: 'GET',
    headers: getHeaders()
  });
  return response.json();
};

// Get category by ID
export const getCategoryById = async (categoryId) => {
  const response = await fetch(getUrl('/categories/:id', { id: categoryId }), {
    method: 'GET',
    headers: getHeaders()
  });
  return response.json();
};

// Get subcategories by category
export const getSubcategoriesByCategory = async (categoryId) => {
  const response = await fetch(getUrl('/categories/:id/subcategories', { id: categoryId }), {
    method: 'GET',
    headers: getHeaders()
  });
  return response.json();
};

// Get categories for navigation
export const getCategoriesForNavigation = async () => {
  try {
    const data = await getAllCategories();
    
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
};

// Get property types by category
export const getPropertyTypesByCategory = async (categoryId) => {
  try {
    const subcategories = await getSubcategoriesByCategory(categoryId);
    
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
};

// Legacy categoryAPI object for backward compatibility
export const categoryAPI = {
  getAllCategories,
  getCategoryById,
  getSubcategoriesByCategory,
  getCategoriesForNavigation,
  getPropertyTypesByCategory
};
