// components/PropertyListing/PropertyListing.jsx
import React, { useState, useEffect } from 'react';
import { useLocation } from '../../../contexts/LocationContext';
import PropertyCard from './PropertyCard';
import { getFeaturedPropertiesByCity, filterProperties } from '../../data/mockPropertyData';
import './PropertyListing.css';

const PropertyListing = ({ searchFilters = {} }) => {
  const { currentLocation } = useLocation();
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewAll, setViewAll] = useState(false);

  // Fetch properties when location changes
  useEffect(() => {
    setLoading(true);
    // Simulate API call delay
    setTimeout(() => {
      const cityProperties = getFeaturedPropertiesByCity(currentLocation.name);
      setProperties(cityProperties);
      setLoading(false);
    }, 500);
  }, [currentLocation]);

  // Apply filters when searchFilters or properties change
  useEffect(() => {
    if (properties.length > 0) {
      const filtered = filterProperties(properties, searchFilters);
      setFilteredProperties(filtered);
    }
  }, [properties, searchFilters]);

  // Properties to display (limited or all)
  const displayProperties = viewAll ? filteredProperties : filteredProperties.slice(0, 3);

  if (loading) {
    return (
      <div className="property-listing-container">
        <div className="loading-skeleton">
          <div className="skeleton-card"></div>
          <div className="skeleton-card"></div>
          <div className="skeleton-card"></div>
        </div>
      </div>
    );
  }

  if (filteredProperties.length === 0) {
    return (
      <div className="property-listing-container">
        <div className="no-properties">
        <img 
            src="https://placehold.co/200x200?text=No+Properties" 
            alt="No properties found"
            className="no-properties-image"
          />
          <h3>No properties found in {currentLocation.name}</h3>
          <p>Try adjusting your search filters or explore other cities</p>
        </div>
      </div>
    );
  }

  return (
    <div className="property-listing-container">
      {/* Header Section */}
      <div className="listing-header">
        <h2 className="listing-title">
          Featured Projects
          {currentLocation && <span className="city-name"> in {currentLocation.name}</span>}
        </h2>
        {filteredProperties.length > 3 && !viewAll && (
          <button 
            className="see-all-btn"
            onClick={() => setViewAll(true)}
          >
            See all Projects
            <i className="fa fa-arrow-right"></i>
          </button>
        )}
        {viewAll && (
          <button 
            className="see-less-btn"
            onClick={() => setViewAll(false)}
          >
            Show Less
            <i className="fa fa-arrow-up"></i>
          </button>
        )}
      </div>

      {/* Properties Grid */}
      <div className="properties-grid">
        {displayProperties.map(property => (
          <PropertyCard 
            key={property.id} 
            property={property}
          />
        ))}
      </div>

      {/* Load More for mobile */}
      {!viewAll && filteredProperties.length > 3 && (
        <div className="mobile-load-more">
          <button 
            className="load-more-btn"
            onClick={() => setViewAll(true)}
          >
            View More Properties ({filteredProperties.length - 3} more)
          </button>
        </div>
      )}

      {/* Results Count */}
      <div className="results-info">
        <p>Showing {displayProperties.length} of {filteredProperties.length} properties</p>
      </div>
    </div>
  );
};

export default PropertyListing;
