import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
// Make sure to update the CSS file name if you change it.
import './LoginPage.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    // Check if already logged in
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);


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
      const response = await login(formData.email, formData.password);
      
      if (response.success) {
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
      setError('Login failed. Please check your credentials and try again.');
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