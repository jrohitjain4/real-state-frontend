// components/PropertyCard/PropertyCard.jsx
import React from 'react';
import './PropertyCard.css';

const PropertyCard = ({ property }) => {
  const {
    id,
    title,
    description,
    address,
    locality,
    city,
    state,
    bedrooms,
    bathrooms,
    superArea,
    price,
    furnishingStatus,
    possessionStatus,
    images,
    subcategory,
    owner,
    features
  } = property;

  const formatPrice = (price) => {
    const numPrice = parseFloat(price);
    if (numPrice >= 10000000) {
      return `₹ ${(numPrice / 10000000).toFixed(2)} Cr`;
    } else if (numPrice >= 100000) {
      return `₹ ${(numPrice / 100000).toFixed(0)} Lac`;
    }
    return `₹ ${numPrice.toLocaleString('en-IN')}`;
  };

  const getConfigurationText = () => {
    if (bedrooms && bathrooms) {
      return `${bedrooms} BHK ${subcategory?.name || 'Property'}`;
    }
    return subcategory?.name || 'Property';
  };

  const getMainImage = () => {
    if (images && images.length > 0) {
      return `http://localhost:5000${images[0].imageUrl}`;
    }
    return '/img/portfolio/01-small.jpg'; // fallback image
  };

  return (
    <div className="property-card">
      {/* Property Image */}
      <div className="property-image-container">
        <img 
          src={getMainImage()} 
          alt={title}
          className="property-image"
        />
        {possessionStatus && (
          <span className="property-status">{possessionStatus.replace('-', ' ').toUpperCase()}</span>
        )}
      </div>

      {/* Property Details */}
      <div className="property-details">
        {/* Property Info */}
        <div className="builder-info">
          <div className="project-info">
            <h3 className="project-name">{title}</h3>
            <p className="builder-name">by {owner ? `${owner.firstName} ${owner.lastName}` : 'Private Owner'}</p>
            <p className="property-location">{locality}, {city}</p>
            {superArea && (
              <p className="property-area">CARPET AREA {superArea} sqft</p>
            )}
          </div>
        </div>

        {/* Configuration and Price */}
        <div className="property-footer">
          <div className="configuration">
            <span className="config-text">{getConfigurationText()}</span>
            {furnishingStatus && (
              <span className="furnishing-status">STATUS {furnishingStatus.replace('-', ' ').toUpperCase()}</span>
            )}
          </div>
          <div className="price-info">
            <span className="price-label">{formatPrice(price)}</span>
            {superArea && (
              <span className="price-per-sqft">₹{Math.round(parseFloat(price) / superArea)} per sqft</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;