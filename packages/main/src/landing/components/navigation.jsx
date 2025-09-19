import React, { useState, useEffect } from "react";
import "./navigation.css";
import { authAPI } from "../../api/auth";
import ProfileAvatar from "../../components/ProfileAvatar";
import LocationSelector from "./LocationSelector/LocationSelector";
export const Navigation = (props) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState({
    id: 1,
    name: "New Delhi",
    state: "Delhi",
    propertyCount: 3456
  });

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

  const handleLocationChange = (location) => {
    setSelectedLocation(location);
    // You can pass this to parent or trigger any action
    console.log('Selected location:', location);
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
          
          <div className="navbar-brand-section">
            <a className="navbar-brand page-scroll" href="#page-top">
              RealEstate
            </a>
            
            {/* Location Navigation */}
            <LocationSelector />
          </div>
        </div>

        <div
          className="collapse navbar-collapse"
          id="bs-example-navbar-collapse-1"
        >
          <ul className="nav navbar-nav navbar-right">
            <li>
              <a href="/properties?category=1" className="nav-link">
                Buy
              </a>
            </li>
            <li>
              <a href="/properties?category=2" className="nav-link">
                Rent
              </a>
            </li>
            <li>
              <a href="/properties?category=1" className="nav-link">
                Sell
              </a>
            </li>
            <li>
              <a href="/properties" className="nav-link">
                All Properties
              </a>
            </li>
            <li>
              <a href="#about" className="page-scroll nav-link">
                About
              </a>
            </li>
            <li>
              <a href="#contact" className="page-scroll nav-link">
                Contact
              </a>
            </li>
            {/* User Actions */}
            {isAuthenticated && user && (
              <>
                <li>
                  <a href="/add-property" className="nav-link">
                    <i className="fas fa-plus"></i> Add Property
                  </a>
                </li>
              
              </>
            )}
            
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