/**
 * Simple Auth Service
 * Basic authentication API calls
 */

import apiService from './apiService';
import API_CONFIG from '../config/api';

class AuthService {
  // Login
  async login(email, password) {
    const data = await apiService.post(API_CONFIG.ENDPOINTS.LOGIN, { email, password });
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    return data;
  }

  // Register
  async register(userData) {
    const data = await apiService.post(API_CONFIG.ENDPOINTS.REGISTER, userData);
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    return data;
  }

  // Logout
  async logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return { success: true };
  }

  // Check profile completion
  async checkProfileCompletion() {
    try {
      const data = await apiService.get(API_CONFIG.ENDPOINTS.PROFILE_STATUS);
      return {
        isComplete: data.user?.profileCompleted || false,
        needsLogin: false,
        completionPercentage: data.completionPercentage || 0,
        user: data.user
      };
    } catch (error) {
      return { isComplete: false, needsLogin: true };
    }
  }

  // Get KYC details
  async getKYCDetails() {
    return apiService.get(API_CONFIG.ENDPOINTS.KYC_DETAILS);
  }

  // Upload KYC documents
  async uploadKYCDocuments(kycData) {
    return apiService.post(API_CONFIG.ENDPOINTS.UPLOAD_KYC, kycData);
  }

  // Update profile
  async updateProfile(profileData) {
    return apiService.put(API_CONFIG.ENDPOINTS.UPDATE_PROFILE, profileData);
  }

  // Get current user
  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  // Check if authenticated
  isAuthenticated() {
    return !!localStorage.getItem('token');
  }

  // Get token
  getToken() {
    return localStorage.getItem('token');
  }
}

// Create and export instance
const authService = new AuthService();
export default authService;
