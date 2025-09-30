/**
 * Upload API - Complete upload functions
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

// Helper function to get headers for file upload
const getUploadHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Upload single image
export const uploadImage = async (imageFile) => {
  const formData = new FormData();
  formData.append('image', imageFile);
  
  const response = await fetch(getUrl('/upload/image'), {
    method: 'POST',
    headers: getUploadHeaders(),
    body: formData
  });
  return response.json();
};

// Upload multiple images
export const uploadImages = async (imageFiles) => {
  const formData = new FormData();
  imageFiles.forEach((image, index) => {
    formData.append('images', image);
  });
  
  const response = await fetch(getUrl('/upload/images'), {
    method: 'POST',
    headers: getUploadHeaders(),
    body: formData
  });
  return response.json();
};

// Upload property images
export const uploadPropertyImages = async (propertyId, images) => {
  const formData = new FormData();
  images.forEach((image, index) => {
    formData.append('images', image);
  });
  
  const response = await fetch(getUrl('/properties/:id/upload-images', { id: propertyId }), {
    method: 'POST',
    headers: getUploadHeaders(),
    body: formData
  });
  return response.json();
};

// Upload profile image
export const uploadProfileImage = async (imageFile) => {
  const formData = new FormData();
  formData.append('image', imageFile);
  
  const response = await fetch(getUrl('/upload/profile-image'), {
    method: 'POST',
    headers: getUploadHeaders(),
    body: formData
  });
  return response.json();
};

// Upload KYC documents
export const uploadKYCDocuments = async (documents) => {
  const formData = new FormData();
  Object.keys(documents).forEach(key => {
    if (documents[key]) {
      formData.append(key, documents[key]);
    }
  });
  
  const response = await fetch(getUrl('/auth/upload-kyc'), {
    method: 'POST',
    headers: getUploadHeaders(),
    body: formData
  });
  return response.json();
};

// Get image URL
export const getImageUrl = (imagePath) => {
  if (!imagePath) return '/default-property.jpg';
  if (imagePath.startsWith('http')) return imagePath;
  return `${BASE_URL.replace('/api', '')}${imagePath}`;
};

// Legacy uploadAPI object for backward compatibility
export const uploadAPI = {
  uploadImage,
  uploadImages,
  uploadPropertyImages,
  uploadProfileImage,
  uploadKYCDocuments,
  getImageUrl
};
