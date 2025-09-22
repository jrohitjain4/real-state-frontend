// API service for property categories and counts
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const propertyCategoriesAPI = {
  // Get property counts for specific category and subcategory
  getPropertyCount: async (categoryId, subcategoryName) => {
    try {
      // First get subcategory ID from name
      const subcategoryResponse = await fetch(`${API_BASE_URL}/categories`);
      const subcategoryData = await subcategoryResponse.json();
      
      let subcategoryId = null;
      if (subcategoryData.success) {
        const category = subcategoryData.data.find(cat => cat.id === categoryId);
        if (category && category.subcategories) {
          const subcategory = category.subcategories.find(sub => sub.name === subcategoryName);
          if (subcategory) {
            subcategoryId = subcategory.id;
          }
        }
      }

      // Now get property count using subcategoryId
      const response = await fetch(
        `${API_BASE_URL}/properties?categoryId=${categoryId}&subCategoryId=${subcategoryId}&limit=1`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch property count');
      }

      return data.data.pagination?.total || 0;
    } catch (error) {
      console.error('Error fetching property count:', error);
      return 0;
    }
  },

  // Get all property counts for multiple categories
  getAllPropertyCounts: async (categories) => {
    try {
      const countPromises = categories.map(async (category) => {
        const count = await propertyCategoriesAPI.getPropertyCount(
          category.categoryId, 
          category.subcategoryName
        );
        return { id: category.id, count };
      });

      const results = await Promise.all(countPromises);
      
      // Convert to object
      const counts = {};
      results.forEach(result => {
        counts[result.id] = result.count;
      });

      return counts;
    } catch (error) {
      console.error('Error fetching all property counts:', error);
      // Return zero counts for all categories
      const zeroCounts = {};
      categories.forEach(cat => {
        zeroCounts[cat.id] = 0;
      });
      return zeroCounts;
    }
  }
};
