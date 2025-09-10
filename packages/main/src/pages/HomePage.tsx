import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage: React.FC = () => {
  return (
    <div className="home-page">
      <nav className="navbar">
        <div className="nav-container">
          <div className="logo">RBAC System</div>
          <div className="nav-links">
            <Link to="/login" className="login-btn">Login</Link>
            <Link to="/register" className="register-btn">Register</Link>
          </div>
        </div>
      </nav>

      <section className="hero">
        <h1>Welcome to RBAC System</h1>
        <p>Secure Role-Based Access Control for Your Organization</p>
        <div className="cta-buttons">
          <Link to="/register" className="cta-primary">Get Started</Link>
          <Link to="/login" className="cta-secondary">Sign In</Link>
        </div>
      </section>

      <section className="features">
        <div className="feature-card">
          <h3>👤 User Dashboard</h3>
          <p>Personal workspace with customized access</p>
        </div>
        <div className="feature-card">
          <h3>👮 Admin Panel</h3>
          <p>Complete control over users and permissions</p>
        </div>
        <div className="feature-card">
          <h3>🔒 Secure Access</h3>
          <p>Role-based security at every level</p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;