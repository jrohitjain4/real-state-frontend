import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../api/auth';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [profileCompletion, setProfileCompletion] = useState({
    isComplete: false,
    percentage: 0,
    canPostProperty: false
  });

  // Check authentication status
  const checkAuth = () => {
    const currentUser = authAPI.getCurrentUser();
    const authenticated = authAPI.isAuthenticated();
    
    if (currentUser && authenticated) {
      setUser(currentUser);
      setIsAuthenticated(true);
    } else {
      setUser(null);
      setIsAuthenticated(false);
      setProfileCompletion({
        isComplete: false,
        percentage: 0,
        canPostProperty: false
      });
    }
    setIsLoading(false);
  };

  // Check profile completion status
  const checkProfileCompletion = async () => {
    if (!isAuthenticated) {
      return {
        isComplete: false,
        needsLogin: true,
        percentage: 0,
        canPostProperty: false
      };
    }

    try {
      const result = await authAPI.checkProfileCompletion();
      setProfileCompletion({
        isComplete: result.isComplete,
        percentage: result.completionPercentage || 0,
        canPostProperty: result.isComplete
      });
      return result;
    } catch (error) {
      console.error('Error checking profile completion:', error);
      return {
        isComplete: false,
        needsLogin: true,
        percentage: 0,
        canPostProperty: false
      };
    }
  };

  // Handle add property click with proper checks
  const handleAddPropertyClick = async () => {
    // Check if user is authenticated
    if (!isAuthenticated || !user) {
      window.location.href = '/login';
      return;
    }

    // Check if profile is complete
    const profileStatus = await checkProfileCompletion();
    
    if (profileStatus.needsLogin) {
      window.location.href = '/login';
      return;
    }
    
    if (!profileStatus.isComplete) {
      window.location.href = '/complete-profile';
      return;
    }
    
    // Profile is complete, proceed to add property
    window.location.href = '/add-property';
  };

  // Login function
  const login = async (email, password) => {
    try {
      const response = await authAPI.login(email, password);
      
      if (response.success) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        
        setUser(response.user);
        setIsAuthenticated(true);
        
        // Check profile completion after login
        await checkProfileCompletion();
        
        return { success: true, user: response.user };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: error.message || 'Login failed' };
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      
      if (response.success) {
        // Auto login after successful registration
        const loginResponse = await authAPI.login(userData.email, userData.password);
        
        if (loginResponse.success) {
          localStorage.setItem('token', loginResponse.token);
          localStorage.setItem('user', JSON.stringify(loginResponse.user));
          
          setUser(loginResponse.user);
          setIsAuthenticated(true);
          
          // Check profile completion after login
          await checkProfileCompletion();
          
          return { success: true, user: loginResponse.user };
        } else {
          return { success: false, message: 'Registration successful but login failed' };
        }
      } else {
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, message: error.message || 'Registration failed' };
    }
  };

  // Logout function
  const logout = () => {
    authAPI.logout();
    setUser(null);
    setIsAuthenticated(false);
    setProfileCompletion({
      isComplete: false,
      percentage: 0,
      canPostProperty: false
    });
  };

  // Initialize auth state
  useEffect(() => {
    checkAuth();

    // Listen for storage changes (when user logs in/out in another tab)
    const handleStorageChange = (e) => {
      if (e.key === 'user' || e.key === 'token') {
        checkAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Check profile completion when user changes
  useEffect(() => {
    if (isAuthenticated && user) {
      checkProfileCompletion();
    }
  }, [isAuthenticated, user]);

  const value = {
    user,
    isAuthenticated,
    isLoading,
    profileCompletion,
    login,
    register,
    logout,
    checkProfileCompletion,
    handleAddPropertyClick
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
