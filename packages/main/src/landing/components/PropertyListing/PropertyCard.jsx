// components/PropertyCard/PropertyCard.jsx
import React from 'react';
import './PropertyCard.css';

const PropertyCard = ({ property }) => {
  const {
    id,
    projectName,
    builderName,
    builderLogo,
    marketedBy,
    location,
    city,
    configurations,
    priceRange,
    mainImage,
    propertyType,
    status,
    featured
  } = property;

  const formatPrice = (price) => {
    if (price >= 10000000) {
      return `₹ ${(price / 10000000).toFixed(2)} Cr`;
    } else if (price >= 100000) {
      return `₹ ${(price / 100000).toFixed(0)} Lac`;
    }
    return `₹ ${price.toLocaleString('en-IN')}`;
  };

  const getConfigurationText = () => {
    if (configurations.length === 1) {
      return `${configurations[0]} ${propertyType}s`;
    }
    return `${configurations[0]} to ${configurations[configurations.length - 1]} ${propertyType}s`;
  };

  return (
    <div className="property-card">
      {/* Property Image */}
      <div className="property-image-container">
        <img 
          src={mainImage} 
          alt={projectName}
          className="property-image"
        />
        {status && (
          <span className="property-status">{status}</span>
        )}
      </div>

      {/* Property Details */}
      <div className="property-details">
        {/* Builder Info */}
        <div className="builder-info">
          <img 
            src={builderLogo} 
            alt={builderName}
            className="builder-logo"
          />
          <div className="project-info">
            <h3 className="project-name">{projectName}</h3>
            <p className="builder-name">by {builderName}</p>
            <p className="property-location">{location}</p>
            {marketedBy && (
              <p className="marketed-by">Marketed by {marketedBy}</p>
            )}
          </div>
        </div>

        {/* Configuration and Price */}
        <div className="property-footer">
          <div className="configuration">
            <span className="config-text">{getConfigurationText()}</span>
          </div>
          <div className="price-info">
            <span className="price-label">{priceRange.label || `${formatPrice(priceRange.min)} onwards`}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;