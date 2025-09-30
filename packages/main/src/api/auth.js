/**
 * Auth API - Complete authentication functions
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

// Login
export const login = async (email, password) => {
  const response = await fetch(getUrl('/auth/login'), {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ email, password })
  });
  const data = await response.json();
  
  if (data.token) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
  }
  return data;
};

// Register
export const register = async (userData) => {
  const response = await fetch(getUrl('/auth/register'), {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(userData)
  });
  const data = await response.json();
  
  if (data.token) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
  }
  return data;
};

// Logout
export const logout = async () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  return { success: true };
};

// Check profile completion
export const checkProfileCompletion = async () => {
  try {
    const response = await fetch(getUrl('/data/profile-status'), {
      method: 'GET',
      headers: getHeaders()
    });
    const data = await response.json();
    
    return {
      isComplete: data.user?.profileCompleted || false,
      needsLogin: false,
      completionPercentage: data.completionPercentage || 0,
      user: data.user
    };
  } catch (error) {
    return { isComplete: false, needsLogin: true };
  }
};

// Get KYC details
export const getKYCDetails = async () => {
  const response = await fetch(getUrl('/data/kyc-details'), {
    method: 'GET',
    headers: getHeaders()
  });
  return response.json();
};

// Upload KYC documents
export const uploadKYCDocuments = async (kycData) => {
  const response = await fetch(getUrl('/auth/upload-kyc'), {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(kycData)
  });
  return response.json();
};

// Update profile
export const updateProfile = async (profileData) => {
  const response = await fetch(getUrl('/user/update-profile'), {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(profileData)
  });
  return response.json();
};

// Get current user
export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// Check if authenticated
export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

// Get token
export const getToken = () => {
  return localStorage.getItem('token');
};

// Legacy authAPI object for backward compatibility
export const authAPI = {
  login,
  register,
  logout,
  checkProfileCompletion,
  getKYCDetails,
  uploadKYCDocuments,
  updateProfile,
  getCurrentUser,
  isAuthenticated,
  getToken
};