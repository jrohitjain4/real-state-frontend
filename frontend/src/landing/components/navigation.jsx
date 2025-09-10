import React, { useState, useEffect } from "react";
import { authAPI } from "../../api/auth";
import ProfileAvatar from "../../components/ProfileAvatar";

export const Navigation = (props) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is authenticated on component mount
    const checkAuth = () => {
      const currentUser = authAPI.getCurrentUser();
      const authenticated = authAPI.isAuthenticated();
      
      if (currentUser && authenticated) {
        setUser(currentUser);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    };

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

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <nav id="menu" className="navbar navbar-default navbar-fixed-top">
      <div className="container">
        <div className="navbar-header">
          <button
            type="button"
            className="navbar-toggle collapsed"
            data-toggle="collapse"
            data-target="#bs-example-navbar-collapse-1"
          >
            {" "}
            <span className="sr-only">Toggle navigation</span>{" "}
            <span className="icon-bar"></span>{" "}
            <span className="icon-bar"></span>{" "}
            <span className="icon-bar"></span>{" "}
          </button>
          <a className="navbar-brand page-scroll" href="#page-top" style={{ color: '#4d2f6a' }}>
            GETYOURDREAM
          </a>{" "}
        </div>

        <div
          className="collapse navbar-collapse"
          id="bs-example-navbar-collapse-1"
        >
          <ul className="nav navbar-nav navbar-right">
            <li>
              <a href="#features" className="page-scroll">
                Buy
              </a>
            </li>
            <li>
              <a href="#services" className="page-scroll">
                Rent
              </a>
            </li>
            <li>
              <a href="#testimonials" className="page-scroll">
                Sell
              </a>
            </li>
            <li>
              <a href="#services" className="page-scroll">
                  Services
              </a>
            </li>
            <li>
              <a href="#about" className="page-scroll">
                  About
              </a>
            </li>
            <li>
              <a href="#contact" className="page-scroll">
                  Contact
              </a>
            </li>
            
            
            {/* Authentication Section */}
            <li className="auth-section">
              {isAuthenticated && user ? (
                <ProfileAvatar user={user} onLogout={handleLogout} />
              ) : (
                <>
                  <a href="/login" className="nav-login-link">
                    Login
                  </a>
                  <a href="/register" className="nav-register-btn">
                    Get Started
                  </a>
                </>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};