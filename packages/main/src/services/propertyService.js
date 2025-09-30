/**
 * Simple Property Service
 * Basic property API calls
 */

import apiService from './apiService';
import API_CONFIG from '../config/api';

class PropertyService {
  // Get all properties
  async getProperties(filters = {}) {
    const queryParams = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
        queryParams.append(key, filters[key]);
      }
    });
    
    const endpoint = `${API_CONFIG.ENDPOINTS.PROPERTIES}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiService.get(endpoint);
  }

  // Get property by slug
  async getPropertyBySlug(slug) {
    return apiService.get(API_CONFIG.ENDPOINTS.PROPERTY_BY_SLUG, { slug });
  }

  // Create property
  async createProperty(propertyData) {
    return apiService.post(API_CONFIG.ENDPOINTS.CREATE_PROPERTY, propertyData);
  }

  // Update property
  async updateProperty(propertyId, propertyData) {
    return apiService.put(API_CONFIG.ENDPOINTS.UPDATE_PROPERTY, propertyData, { id: propertyId });
  }

  // Delete property
  async deleteProperty(propertyId) {
    return apiService.delete(API_CONFIG.ENDPOINTS.DELETE_PROPERTY, { id: propertyId });
  }

  // Upload property images
  async uploadPropertyImages(propertyId, images) {
    const formData = new FormData();
    images.forEach((image, index) => {
      formData.append('images', image);
    });
    
    return apiService.uploadFile(API_CONFIG.ENDPOINTS.UPLOAD_PROPERTY_IMAGES, formData, { id: propertyId });
  }

  // Get similar properties
  async getSimilarProperties(currentProperty) {
    if (!currentProperty) return [];
    
    try {
      // Try same city + same subcategory first
      let similar = await this.getProperties({
        limit: 10,
        city: currentProperty.city,
        subCategoryId: currentProperty.subCategoryId
      });
      
      if (similar.success && similar.data.properties && similar.data.properties.length > 0) {
        return similar.data.properties.filter(p => p.slug !== currentProperty.slug).slice(0, 6);
      }
      
      // If not enough, try same city
      similar = await this.getProperties({
        limit: 10,
        city: currentProperty.city
      });
      
      if (similar.success && similar.data.properties) {
        return similar.data.properties.filter(p => p.slug !== currentProperty.slug).slice(0, 6);
      }
      
      return [];
    } catch (error) {
      console.error('Error fetching similar properties:', error);
      return [];
    }
  }

  // Get property image URL
  getPropertyImageUrl(relativePath) {
    return apiService.getImageUrl(relativePath);
  }
}

// Create and export instance
const propertyService = new PropertyService();
export default propertyService;
