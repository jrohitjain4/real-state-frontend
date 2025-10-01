import React from 'react';
import { Link } from 'react-router-dom';
import { getPropertyImageUrl } from '../api/property'; // Make sure this path is correct

const PropertyCard = ({ property }) => {
  const imageUrl = property.images?.[0]?.imageUrl;

  return (
    <div className="property-card">
      <Link to={`/property/${property.slug}`} className="property-image-link">
        <div className="property-image">
          {imageUrl ? (
            <img
              src={getPropertyImageUrl(imageUrl)}
              alt={property.title}
              onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.querySelector('.no-image-placeholder').style.display = 'flex'; }}
            />
          ) : null}
          <div className="no-image-placeholder" style={{ display: imageUrl ? 'none' : 'flex' }}>
            <i className="fas fa-image"></i>
          </div>
          <div className="property-image-overlay"></div>
          <span className={`property-status ${property.status?.toLowerCase()}`}>
            {property.status || 'Active'}
          </span>
          <div className="property-price">₹{property.price?.toLocaleString() || 'N/A'}</div>
        </div>
      </Link>
      <div className="property-content">
        <h3 className="property-title">
          <Link to={`/property/${property.slug}`}>{property.title || 'Untitled Property'}</Link>
        </h3>
        <p className="property-location">
          <i className="fas fa-map-marker-alt"></i>
          {property.address || 'No address provided'}
        </p>
        <div className="property-meta">
          <span><i className="fas fa-bed"></i> {property.bedrooms || 'N/A'} Beds</span>
          <span><i className="fas fa-bath"></i> {property.bathrooms || 'N/A'} Baths</span>
          <span><i className="fas fa-ruler-combined"></i> {property.area || 'N/A'} sqft</span>
        </div>
        <div className="property-actions">
          <Link to={`/edit-property/${property.id}`} className="btn btn-outline btn-sm">
            <i className="fas fa-edit"></i>
            Edit
          </Link>
          <Link to={`/property/${property.slug}`} className="btn btn-outline btn-sm">
            <i className="fas fa-eye"></i>
            View
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;