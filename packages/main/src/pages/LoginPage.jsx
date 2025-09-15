import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../api/auth';
// Make sure to update the CSS file name if you change it.
import './LoginPage.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

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
          callback: handleGoogleLogin,
          auto_select: false,
          cancel_on_tap_outside: true
        });

        window.google.accounts.id.renderButton(
          document.getElementById('googleSignInButton'),
          {
            theme: 'outline',
            size: 'large',
            width: '100%',
            text: 'continue_with',
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

  const handleGoogleLogin = async (response) => {
    setLoading(true);
    setError('');
    
    try {
      // Decode JWT token from Google
      const payload = JSON.parse(atob(response.credential.split('.')[1]));
      
      const googleUserData = {
        name: payload.name,
        email: payload.email,
        password: 'google_oauth_user',
        role: 'user',
        googleId: payload.sub,
        picture: payload.picture
      };
  
      try {
        // Try to login first
        const loginResponse = await authAPI.login(googleUserData.email, googleUserData.password);
        
        if (loginResponse.success) {
          localStorage.setItem('token', loginResponse.token);
          localStorage.setItem('user', JSON.stringify(loginResponse.user));
          if (rememberMe) {
            localStorage.setItem('rememberMe', 'true');
          }
          navigate('/');
        }
      } catch (loginError) {
        if (loginError.response?.data?.message?.includes('Invalid credentials')) {
          setError('This email is already registered. Please use your password to login.');
          return;
        }
        
        if (loginError.response?.status === 400 || loginError.response?.status === 401) {
          try {
            const registerResponse = await authAPI.register(googleUserData);
            
            if (registerResponse.success) {
              const loginResponse = await authAPI.login(googleUserData.email, googleUserData.password);
              
              if (loginResponse.success) {
                localStorage.setItem('token', loginResponse.token);
                localStorage.setItem('user', JSON.stringify(loginResponse.user));
                if (rememberMe) {
                  localStorage.setItem('rememberMe', 'true');
                }
                navigate('/');
              }
            }
          } catch (registerError) {
            if (registerError.response?.data?.message?.includes('already exists') ||
                registerError.response?.data?.message?.includes('already registered')) {
              setError('This email is already registered. Please use your password to login.');
            } else {
              setError('Failed to create account with Google. Please try again.');
            }
          }
        } else {
          setError('Google authentication failed. Please try again.');
        }
      }
    } catch (err) {
      console.error('Google login error:', err);
      setError('Google login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setRememberMe(checked);
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
      if (error) setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      const response = await authAPI.login(formData.email, formData.password);
      
      if (response.success) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        
        if (rememberMe) {
          localStorage.setItem('rememberMe', 'true');
          localStorage.setItem('savedEmail', formData.email);
        } else {
          localStorage.removeItem('savedEmail');
        }
        
        navigate('/');
      } else {
        setError(response.message || 'Login failed. Please try again.');
      }
    } catch (err) {
      console.error('Login error:', err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Login failed. Please check your credentials and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const savedEmail = localStorage.getItem('savedEmail');
    const wasRemembered = localStorage.getItem('rememberMe');
    
    if (savedEmail && wasRemembered === 'true') {
      setFormData(prev => ({ ...prev, email: savedEmail }));
      setRememberMe(true);
    }
  }, []);

  return (
    <div className="LoginPage-root">
      <div className="LoginPage-container">
        {/* Left Side - Form Section */}
        <div className="LoginPage-formSection">
          <div className="LoginPage-formContent">
            <div className="LoginPage-brandLogo">
              <span>Havenix.</span>
            </div>

            <h1 className="LoginPage-title">Welcome Back</h1>
            <p className="LoginPage-subtitle">Let's login to grab amazing deals</p>

            {/* Google Sign In Button */}
            <div className="LoginPage-oauthSection">
              <div id="googleSignInButton" className="LoginPage-googleButtonContainer"></div>
            </div>

            {/* Divider */}
            <div className="LoginPage-divider">
              <span>Or login with email</span>
            </div>

            {/* Error Message */}
            {error && (
              <div className="LoginPage-errorMessage">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="LoginPage-form">
              <div className="LoginPage-formGroup">
                <label htmlFor="email" className="LoginPage-label">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="LoginPage-input"
                  required
                  autoComplete="email"
                  disabled={loading}
                />
              </div>

              <div className="LoginPage-formGroup">
                <label htmlFor="password" className="LoginPage-label">Password</label>
                <div className="LoginPage-passwordWrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="LoginPage-input"
                    required
                    autoComplete="current-password"
                    disabled={loading}
                  />
                  <button 
                    type="button" 
                    className="LoginPage-passwordToggleBtn"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
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
              </div>

              <div className="LoginPage-formActions">
                <label className="LoginPage-checkboxWrapper">
                  <input 
                    type="checkbox" 
                    id="remember"
                    checked={rememberMe}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  <span>Remember me</span>
                </label>
                <a href="/forgot-password" className="LoginPage-forgotPasswordLink">
                  Forgot Password?
                </a>
              </div>

              <button 
                type="submit" 
                className="LoginPage-submitButton"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg className="LoginPage-spinner" width="20" height="20" viewBox="0 0 24 24">
                      <circle className="LoginPage-spinnerCircle" cx="12" cy="12" r="10" fill="none" strokeWidth="3"/>
                    </svg>
                    <span>Signing In...</span>
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            <p className="LoginPage-signupText">
              Don't have an account? 
              <a href="/register" className="LoginPage-signupLink">Create Account</a>
            </p>
          </div>
        </div>

        {/* Right Side - Image Section */}
        <div className="LoginPage-imageSection">
          <div className="LoginPage-doorContainer">
            <div className="LoginPage-doorFrame">
              <div className="LoginPage-doorContent">
                <div className="LoginPage-overlayText">
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

export default LoginPage;