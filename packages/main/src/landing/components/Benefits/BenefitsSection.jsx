// src/components/BenefitsSection.jsx
// BenefitsSection.jsx
import React from 'react';
import './BenefitsSection.css';

// Data for the benefits grid - easy to update
const benefitsData = [
    {
        title: "Verified Listings",
        description: "All properties are thoroughly checked to ensure authenticity and avoid time-wasting."
    },
    {
        title: "Wide Reach",
        description: "Access thousands of listings across top cities, towns, and emerging locations."
    },
    {
        title: "Direct Communication",
        description: "Connect instantly with sellers, agents, or property managers—no middlemen."
    },
    {
        title: "Expert Guidance",
        description: "Receive professional insights to make informed real estate decisions confidently."
    },
    {
        title: "Tailored Solutions",
        description: "We customize property options based on your specific needs and preferences."
    },
    {
        title: "Seamless Process",
        description: "Enjoy a smooth, stress-free experience from property search to final transaction."
    }
];

// Data for the image gallery
const galleryImages = [
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=60',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=60',
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=60',
    'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=60',
    'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=60',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=60',
];

// Wavy line SVG component for decoration
const WavyLine = ({ mirrored }) => (
    <svg 
        width="66" 
        height="14" 
        viewBox="0 0 66 14" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className={`wavy-line ${mirrored ? 'mirrored' : ''}`}
    >
        <path d="M65.091 1.4468C62.4172 2.91583 59.9813 4.23385 57.192 4.96589C51.7828 6.38194 46.5458 5.4199 41.229 5.03488C35.6323 4.63286 30.1477 4.93188 24.664 5.31689C19.7118 5.66691 14.9459 6.27696 10.1581 6.32496C7.58196 6.35096 4.67923 5.99994 2.31641 5.19292" stroke="#D1D5DB" strokeWidth="2" strokeLinecap="round" />
        <path d="M41.229 8.61816C46.5458 8.94819 51.7828 9.85523 57.192 8.38418C59.9813 7.65213 62.4172 6.33411 65.091 4.86508M2.31641 8.82219C4.67923 9.57221 7.58196 9.86823 10.1581 9.84223C14.9459 9.79422 19.7118 9.12918 24.664 8.72416C30.1477 8.28814 35.6323 7.93412 41.229 8.28114" stroke="#D1D5DB" strokeWidth="2" strokeLinecap="round" />
    </svg>
);


const BenefitsSection = () => {
  return (
    <section className="benefits-section">
      <div className="benefits-container">
        {/* --- Section Header --- */}
        <header className="benefits-header">
          <h2 className="benefits-title">
            <WavyLine />
            Discover the <span>Advantages & Exclusive Benefits</span>
            <WavyLine mirrored />
          </h2>
          <p className="benefits-subtitle">
            Along the way, we've collaborated with incredible clients, tackled exciting challenges
          </p>
        </header>

        {/* --- Benefits Grid --- */}
        <div className="benefits-grid">
          {benefitsData.map((benefit, index) => (
            <div key={index} className="benefit-item">
              <div className="benefit-icon">
                <i className="fas fa-check"></i>
              </div>
              <h3 className="benefit-item-title">{benefit.title}</h3>
              <p className="benefit-item-description">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* --- Image Gallery --- */}
      <div className="gallery-container">
        {galleryImages.map((src, index) => (
          <div key={index} className="gallery-image-wrapper">
            <img src={src} alt={`Real estate gallery ${index + 1}`} className="gallery-image" />
          </div>
        ))}
      </div>
    </section>
  );
};
export default BenefitsSection;