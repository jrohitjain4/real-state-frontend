/**
 * Simple API Service
 * Basic API calls without complex features
 */

import API_CONFIG from '../config/api';

class ApiService {
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
  }

  // Get full URL
  getUrl(endpoint, params = {}) {
    let url = `${this.baseURL}${endpoint}`;
    
    // Replace URL parameters like :id, :slug
    Object.keys(params).forEach(key => {
      url = url.replace(`:${key}`, params[key]);
    });
    
    return url;
  }

  // Get request
  async get(endpoint, params = {}) {
    const url = this.getUrl(endpoint, params);
    const token = localStorage.getItem('token');
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
    });
    
    return response.json();
  }

  // Post request
  async post(endpoint, data, params = {}) {
    const url = this.getUrl(endpoint, params);
    const token = localStorage.getItem('token');
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      body: JSON.stringify(data)
    });
    
    return response.json();
  }

  // Put request
  async put(endpoint, data, params = {}) {
    const url = this.getUrl(endpoint, params);
    const token = localStorage.getItem('token');
    
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      body: JSON.stringify(data)
    });
    
    return response.json();
  }

  // Delete request
  async delete(endpoint, params = {}) {
    const url = this.getUrl(endpoint, params);
    const token = localStorage.getItem('token');
    
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
    });
    
    return response.json();
  }

  // Upload file
  async uploadFile(endpoint, formData, params = {}) {
    const url = this.getUrl(endpoint, params);
    const token = localStorage.getItem('token');
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      body: formData
    });
    
    return response.json();
  }

  // Get image URL
  getImageUrl(imagePath) {
    if (!imagePath) return '/default-property.jpg';
    if (imagePath.startsWith('http')) return imagePath;
    return `${this.baseURL.replace('/api', '')}${imagePath}`;
  }
}

// Create and export instance
const apiService = new ApiService();
export default apiService;
