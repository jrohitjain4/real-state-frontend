import React, { useState, useEffect } from 'react';
import { authAPI } from '../api/auth';
import './LoginPage.css';

const LoginPage = () => {
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
    const initializeGoogleSignIn = () => {
      if (window.google && window.google.accounts) {
        window.google.accounts.id.initialize({
          client_id: '392443145374-gmn8kg445ulc035mru4c61nh4oodh7aa.apps.googleusercontent.com',
          callback: handleGoogleLogin
        });

        window.google.accounts.id.renderButton(
          document.getElementById('googleSignInButton'),
          {
            theme: 'outline',
            size: 'large',
            width: '100%',
            text: 'continue_with',
            shape: 'rectangular'
          }
        );
      }
    };

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.onload = initializeGoogleSignIn;
    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  const handleGoogleLogin = async (response) => {
    try {
      const payload = JSON.parse(atob(response.credential.split('.')[1]));
      
      const userData = {
        name: payload.name,
        email: payload.email,
        password: 'google_oauth_user',
        role: 'user',
        googleId: payload.sub,
        picture: payload.picture
      };

      try {
        const loginResponse = await authAPI.login(userData.email, userData.password);
        localStorage.setItem('token', loginResponse.token);
        localStorage.setItem('user', JSON.stringify(loginResponse.user));
        window.location.href = '/';
        return;
      } catch (loginError) {
        try {
          const registerResponse = await authAPI.register(userData);
          const loginResponse = await authAPI.login(userData.email, userData.password);
          localStorage.setItem('token', loginResponse.token);
          localStorage.setItem('user', JSON.stringify(loginResponse.user));
          window.location.href = '/';
        } catch (registerError) {
          setError('Google authentication failed. Please try again.');
        }
      }
    } catch (err) {
      console.error('Google login error:', err);
      setError('Google login failed. Please try again.');
    }
  };

  const handleChange = (e) => {
    if (e.target.type === 'checkbox') {
      setRememberMe(e.target.checked);
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authAPI.login(formData.email, formData.password);
      window.location.href = '/';
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Left Side - Form Section */}
        <div className="login-form-section">
          <div className="form-content">
            <div className="brand-logo">
              <span>Havenix.</span>
            </div>
            
            <h1 className="welcome-title">Wellcome Back</h1>
            <p className="welcome-subtitle">Let's login to grab amazing deal</p>

            <div className="oauth-buttons">
              <div id="googleSignInButton" className="google-button-container"></div>
              
              <button className="oauth-button facebook-button">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="#1877F2">
                  <path d="M20 10C20 4.477 15.523 0 10 0S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z"/>
                </svg>
                <span>Continue with Facebook</span>
              </button>
            </div>

            <div className="divider">
              <span>Or</span>
            </div>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="rownok@gmail.com"
                  required
                />
              </div>

              <div className="form-group">
                <div className="password-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••••••"
                    required
                  />
                  <button 
                    type="button" 
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      {showPassword ? (
                        <>
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                          <path d="M1 1l22 22"/>
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

              <div className="form-actions">
                <label className="remember-checkbox">
                  <input 
                    type="checkbox" 
                    id="remember"
                    checked={rememberMe}
                    onChange={handleChange}
                  />
                  <span>Remember me</span>
                </label>
                <a href="#" className="forgot-link">Forgot Password?</a>
              </div>

              <button type="submit" className="login-button" disabled={loading}>
                {loading ? 'Signing In...' : 'Login'}
              </button>
            </form>

            <p className="signup-text">
              Don't have an account? <a href="/register" className="signup-link">Sign Up</a>
            </p>
          </div>
        </div>

        {/* Right Side - Image Section */}
        <div className="login-image-section">
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

export default LoginPage;