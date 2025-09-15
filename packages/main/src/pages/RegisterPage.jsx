import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../api/auth';
import './RegisterPage.css';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user' // Default role
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Google OAuth setup
  useEffect(() => {
    // Check if already logged in
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/');
    }

    const initializeGoogleSignIn = () => {
      if (window.google && window.google.accounts) {
        window.google.accounts.id.initialize({
          client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID || '392443145374-gmn8kg445ulc035mru4c61nh4oodh7aa.apps.googleusercontent.com',
          callback: handleGoogleRegister,
          auto_select: false,
          cancel_on_tap_outside: true
        });

        window.google.accounts.id.renderButton(
          document.getElementById('googleRegisterButton'),
          {
            theme: 'outline',
            size: 'large',
            width: '100%',
            text: 'signup_with',
            shape: 'rectangular',
            logo_alignment: 'left'
          }
        );
      }
    };

    // Load Google Script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = initializeGoogleSignIn;
    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [navigate]);

  const handleGoogleRegister = async (response) => {
    setGoogleLoading(true);
    setErrors({});
    
    try {
      // Decode JWT token from Google
      const payload = JSON.parse(atob(response.credential.split('.')[1]));
      
      const googleUserData = {
        name: payload.name,
        email: payload.email,
        password: 'google_oauth_user',
        role: formData.role || 'user', // Use selected role or default to 'user'
        googleId: payload.sub,
        picture: payload.picture
      };

      try {
        // First check if user already exists by trying to login
        const loginResponse = await authAPI.login(googleUserData.email, googleUserData.password);
        
        if (loginResponse.success) {
          // User already exists, just log them in
          localStorage.setItem('token', loginResponse.token);
          localStorage.setItem('user', JSON.stringify(loginResponse.user));
          navigate('/');
        }
      } catch (loginError) {
        // User doesn't exist, register them
        try {
          const registerResponse = await authAPI.register(googleUserData);
          
          if (registerResponse.success) {
            // Auto login after registration
            const loginResponse = await authAPI.login(googleUserData.email, googleUserData.password);
            
            if (loginResponse.success) {
              localStorage.setItem('token', loginResponse.token);
              localStorage.setItem('user', JSON.stringify(loginResponse.user));
              navigate('/');
            }
          }
        } catch (registerError) {
          setErrors({ general: 'Failed to create account with Google. Please try again.' });
        }
      }
    } catch (err) {
      console.error('Google register error:', err);
      setErrors({ general: 'Google registration failed. Please try again.' });
    } finally {
      setGoogleLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      // Prepare user data
      const userData = {
        name: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        role: formData.role
      };

      const response = await authAPI.register(userData);

      if (response.success) {
        // Auto login after successful registration
        const loginResponse = await authAPI.login(userData.email, userData.password);
        
        if (loginResponse.success) {
          localStorage.setItem('token', loginResponse.token);
          localStorage.setItem('user', JSON.stringify(loginResponse.user));
          navigate('/');
        } else {
          // Registration successful but login failed, redirect to login page
          navigate('/login?registered=true');
        }
      } else {
        setErrors({ general: response.message || 'Registration failed. Please try again.' });
      }
    } catch (err) {
      console.error('Registration error:', err);
      
      if (err.response?.data?.message) {
        setErrors({ general: err.response.data.message });
      } else if (err.response?.data?.errors) {
        // Handle validation errors from backend
        const backendErrors = {};
        err.response.data.errors.forEach(error => {
          backendErrors[error.field] = error.message;
        });
        setErrors(backendErrors);
      } else {
        setErrors({ general: 'Registration failed. Please try again later.' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        {/* Left Side - Register Form */}
        <div className="register-form-section">
          <div className="form-content">
            <div className="brand-logo">
              <span>Havenix.</span>
            </div>

            <div className="welcome-section">
              <h1 className="register-title">Create Account</h1>
              <p className="register-subtitle">Join us to get started with amazing deals</p>
            </div>

            {/* Google Sign Up */}
            <div className="oauth-section">
              <div id="googleRegisterButton" className="google-button-container"></div>
            </div>

            {/* Divider */}
            <div className="divider">
              <span>Or register with email</span>
            </div>

            {/* Error Messages */}
            {errors.general && (
              <div className="error-message">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                </svg>
                <span>{errors.general}</span>
              </div>
            )}

            {/* Register Form */}
            <form onSubmit={handleSubmit} className="register-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName" className="form-label">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`form-input ${errors.firstName ? 'error' : ''}`}
                    placeholder="John"
                    disabled={loading || googleLoading}
                  />
                  {errors.firstName && (
                    <span className="field-error">{errors.firstName}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="lastName" className="form-label">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`form-input ${errors.lastName ? 'error' : ''}`}
                    placeholder="Doe"
                    disabled={loading || googleLoading}
                  />
                  {errors.lastName && (
                    <span className="field-error">{errors.lastName}</span>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email" className="form-label">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`form-input ${errors.email ? 'error' : ''}`}
                  placeholder="you@example.com"
                  disabled={loading || googleLoading}
                />
                {errors.email && (
                  <span className="field-error">{errors.email}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="role" className="form-label">I want to join as</label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="form-select"
                  disabled={loading || googleLoading}
                >
                  <option value="user">User (Buy/Rent Properties)</option>
                  <option value="agent">Agent (Sell/List Properties)</option>
                </select>
              </div>
              <div className="form-roww">
                <div className="form-group">
                  <label htmlFor="password" className="form-label">Password</label>
                  <div className="password-input-wrapper">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`form-input ${errors.password ? 'error' : ''}`}
                      placeholder="••••••••"
                      disabled={loading || googleLoading}
                    />
                    <button 
                      type="button" 
                      className="password-toggle-btn"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={loading || googleLoading}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        {showPassword ? (
                          <>
                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                            <line x1="1" y1="1" x2="23" y2="23"/>
                          </>
                        ) : (
                          <>
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                            <circle cx="12" cy="12" r="3"/>
                          </>
                        )}
                      </svg>
                    </button>
                  </div>
                  {errors.password && (
                    <span className="field-error">{errors.password}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                  <div className="password-input-wrapper">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                      placeholder="••••••••"
                      disabled={loading || googleLoading}
                    />
                    <button 
                      type="button" 
                      className="password-toggle-btn"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      disabled={loading || googleLoading}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        {showConfirmPassword ? (
                          <>
                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                            <line x1="1" y1="1" x2="23" y2="23"/>
                          </>
                        ) : (
                          <>
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                            <circle cx="12" cy="12" r="3"/>
                          </>
                        )}
                      </svg>
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <span className="field-error">{errors.confirmPassword}</span>
                  )}
                </div>
              </div>
              

              <button 
                type="submit" 
                className="submit-button"
                disabled={loading || googleLoading}
              >
                {loading ? (
                  <>
                    <svg className="spinner" width="20" height="20" viewBox="0 0 24 24">
                      <circle className="spinner-circle" cx="12" cy="12" r="10" fill="none" strokeWidth="3"/>
                    </svg>
                    <span>Creating Account...</span>
                  </>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>

            <p className="signin-text">
              Already have an account? 
              <Link to="/login" className="signin-link">Sign In</Link>
            </p>
          </div>
        </div>

        {/* Right Side - Image Section */}
        <div className="register-image-section">
          <div className="door-container">
            <div className="door-frame">
              <div className="door-content">
                <div className="overlay-text">
                  Browse thousands of properties to buy, sell,<br />
                  or rent with trusted agents.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;