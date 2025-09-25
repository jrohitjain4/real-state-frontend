import React, { useState } from 'react';
import './Footer.css';
import {
  FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram, FaYoutube,
  FaMapMarkerAlt, FaPhone, FaEnvelope, FaChevronUp, FaHome,
  FaUser, FaCog, FaEnvelopeOpen
} from 'react-icons/fa';

const Footer = () => {
  const [email, setEmail] = useState('');

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email) {
      alert(`Thank you for subscribing with email: ${email}`);
      setEmail('');
    }
  };

  // Data arrays for clean code organization
  const socialLinks = [
    { icon: FaFacebookF, url: '#', label: 'Facebook' },
    { icon: FaTwitter, url: '#', label: 'Twitter' },
    { icon: FaLinkedinIn, url: '#', label: 'LinkedIn' },
    { icon: FaInstagram, url: '#', label: 'Instagram' },
    { icon: FaYoutube, url: '#', label: 'YouTube' }
  ];

  const quickLinks = [
    { icon: FaHome, text: 'Home', url: '#' },
    { icon: FaUser, text: 'About Us', url: '#' },
    { icon: FaCog, text: 'Services', url: '#' },
    { icon: FaEnvelopeOpen, text: 'Contact', url: '#' },
    { icon: FaUser, text: 'Privacy Policy', url: '#' },
    { icon: FaCog, text: 'Terms of Service', url: '#' }
  ];

  const contactInfo = [
    { icon: FaMapMarkerAlt, text: '123 Business Street, City, State 12345', label: 'Address' },
    { icon: FaPhone, text: '+1 (555) 123-4567', label: 'Phone' },
    { icon: FaEnvelope, text: 'info@yourcompany.com', label: 'Email' }
  ];

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Column 1: About Us */}
        <div className="footer-column">
          <div className="footer-section">
            <h3 className="footer-title">About Us</h3>
            <div className="company-logo">
              <span className="logo-text">YourCompany</span>
            </div>
            <p className="footer-description">
              We are a leading company dedicated to providing exceptional services and solutions. 
              Our mission is to deliver quality and innovation in everything we do.
            </p>
            <div className="social-links">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  className="social-link"
                  aria-label={social.label}
                >
                  <social.icon />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div className="footer-column">
          <div className="footer-section">
            <h3 className="footer-title">Quick Links</h3>
            <ul className="footer-links">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a href={link.url} className="footer-link">
                    <link.icon className="link-icon" />
                    {link.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Column 3: Contact Info */}
        <div className="footer-column">
          <div className="footer-section">
            <h3 className="footer-title">Contact Info</h3>
            <div className="contact-info">
              {contactInfo.map((contact, index) => (
                <div key={index} className="contact-item">
                  <contact.icon className="contact-icon" />
                  <span className="contact-text">{contact.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Column 4: Newsletter Signup */}
        <div className="footer-column">
          <div className="footer-section">
            <h3 className="footer-title">Newsletter</h3>
            <p className="newsletter-description">
              Subscribe to our newsletter for the latest updates and offers.
            </p>
            <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
              <div className="input-group">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="newsletter-input"
                  required
                />
                <button type="submit" className="newsletter-button">
                  Subscribe
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Sub-Footer */}
      <div className="sub-footer">
        <div className="sub-footer-container">
          <p className="copyright">
            © 2024 YourCompany. All Rights Reserved.
          </p>
          <button onClick={scrollToTop} className="back-to-top" aria-label="Back to top">
            <FaChevronUp />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;