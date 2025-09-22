// Simple auth API for development
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const authAPI = {
  login: async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  register: async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      return data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  getToken: () => {
    return localStorage.getItem('token');
  },

  // Check if user profile is complete
  checkProfileCompletion: async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return { isComplete: false, needsLogin: true };
      }

      const response = await fetch(`${API_BASE_URL}/data/profile-status`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to check profile status');
      }

      return {
        isComplete: data.user.profileCompleted || false,
        needsLogin: false,
        completionPercentage: data.completionPercentage || 0,
        user: data.user
      };
    } catch (error) {
      console.error('Profile completion check error:', error);
      return { isComplete: false, needsLogin: true };
    }
  }
};
