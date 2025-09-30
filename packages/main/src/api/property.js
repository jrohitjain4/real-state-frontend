/**
 * Property API - Complete property functions
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

// Get all properties
export const getProperties = async (filters = {}) => {
  const queryParams = new URLSearchParams();
  Object.keys(filters).forEach(key => {
    if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
      queryParams.append(key, filters[key]);
    }
  });
  
  const endpoint = `/properties${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  const response = await fetch(getUrl(endpoint), {
    method: 'GET',
    headers: getHeaders()
  });
  return response.json();
};

// Get property by slug
export const getPropertyBySlug = async (slug) => {
  const response = await fetch(getUrl('/properties/:slug', { slug }), {
    method: 'GET',
    headers: getHeaders()
  });
  return response.json();
};

// Create property
export const createProperty = async (propertyData) => {
  const response = await fetch(getUrl('/properties'), {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(propertyData)
  });
  return response.json();
};

// Update property
export const updateProperty = async (propertyId, propertyData) => {
  const response = await fetch(getUrl('/properties/:id', { id: propertyId }), {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(propertyData)
  });
  return response.json();
};

// Delete property
export const deleteProperty = async (propertyId) => {
  const response = await fetch(getUrl('/properties/:id', { id: propertyId }), {
    method: 'DELETE',
    headers: getHeaders()
  });
  return response.json();
};

// Upload property images
export const uploadPropertyImages = async (propertyId, images) => {
  const formData = new FormData();
  images.forEach((image, index) => {
    formData.append('images', image);
  });
  
  const token = localStorage.getItem('token');
  const response = await fetch(getUrl('/properties/:id/upload-images', { id: propertyId }), {
    method: 'POST',
    headers: {
      ...(token && { 'Authorization': `Bearer ${token}` })
    },
    body: formData
  });
  return response.json();
};

// Get similar properties
export const getSimilarProperties = async (currentProperty) => {
  if (!currentProperty) return [];
  
  try {
    // Try same city + same subcategory first
    let similar = await getProperties({
      limit: 10,
      city: currentProperty.city,
      subCategoryId: currentProperty.subCategoryId
    });
    
    if (similar.success && similar.data.properties && similar.data.properties.length > 0) {
      return similar.data.properties.filter(p => p.slug !== currentProperty.slug).slice(0, 6);
    }
    
    // If not enough, try same city
    similar = await getProperties({
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
};

// Get property image URL
export const getPropertyImageUrl = (relativePath) => {
  if (!relativePath) return '/default-property.jpg';
  if (relativePath.startsWith('http')) return relativePath;
  return `${BASE_URL.replace('/api', '')}${relativePath}`;
};

// Legacy propertyAPI object for backward compatibility
export const propertyAPI = {
  getProperties,
  getPropertyBySlug,
  createProperty,
  updateProperty,
  deleteProperty,
  uploadPropertyImages,
  getSimilarProperties,
  getPropertyImageUrl
};
