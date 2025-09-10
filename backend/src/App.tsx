import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { authAPI } from './api/auth';
import AdminLayout from './layouts/AdminLayout';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Settings from './pages/Settings';

import Analytics from './pages/Analytics';
import Clients from './pages/Clients';
import Tasks from './pages/Tasks';
import MuiUsers from './pages/MuiUsers';



import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    console.log('🔐 Checking authentication...');
    
    // First try to get auth data from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const authParam = urlParams.get('auth');
    
    if (authParam) {
      console.log('📡 Auth parameter found in URL');
      try {
        const authData = JSON.parse(decodeURIComponent(authParam));
        console.log('✅ Auth data parsed successfully:', authData.user);
        
        // Store auth data in localStorage
        localStorage.setItem('token', authData.token);
        localStorage.setItem('user', JSON.stringify(authData.user));
        
        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);
        
        // Set user state
        setUser(authData.user);
        setIsAuthenticated(true);
        setLoading(false);
        return;
      } catch (error) {
        console.error('❌ Error parsing auth data:', error);
      }
    }

    // Fallback to localStorage
    console.log('🔍 Checking localStorage for existing auth...');
    const storedUser = authAPI.getCurrentUser();
    const hasToken = authAPI.isAuthenticated();

    console.log('📊 Stored user:', storedUser);
    console.log('🔑 Has token:', hasToken);

    if (!hasToken || !storedUser || storedUser.role !== 'admin') {
      console.log('❌ Not authenticated or not admin, redirecting to login...');
      window.location.href = 'http://localhost:3000/login';
      return;
    }

    console.log('✅ User authenticated as admin:', storedUser);
    setUser(storedUser);
    setIsAuthenticated(true);
    setLoading(false);
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px',
        color: '#666'
      }}>
        🔐 Authenticating... Please wait...
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px',
        color: '#666'
      }}>
        ❌ Authentication failed. Redirecting to login...
      </div>
    );
  }

  console.log('🚀 Rendering Admin Dashboard for user:', user);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
     
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/clients" element={<Clients />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/mui-users" element={<MuiUsers />} />
        <Route path="/users" element={<AdminLayout><Users /></AdminLayout>} />
        <Route path="/settings" element={<AdminLayout><Settings /></AdminLayout>} />
           

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;