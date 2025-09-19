// components/PropertyListing/PropertyListing.jsx
import React, { useState, useEffect } from 'react';
import { useLocation } from '../../../contexts/LocationContext';
import PropertyCard from './PropertyCard';
import './PropertyListing.css';

const PropertyListing = ({ searchFilters = {} }) => {
  const { currentLocation } = useLocation();
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewAll, setViewAll] = useState(false);

  // Fetch properties from backend API
  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:5000/api/properties?limit=6');
        const data = await response.json();
        
        if (data.success) {
          // Filter by current location if available
          let cityProperties = data.data.properties || data.data;
          if (currentLocation && currentLocation.name && currentLocation.name !== 'Bangalore') {
            cityProperties = cityProperties.filter(property => 
              property.city && property.city.toLowerCase() === currentLocation.name.toLowerCase()
            );
          }
          setProperties(cityProperties);
        } else {
          console.error('Failed to fetch properties:', data.message);
          setProperties([]);
        }
      } catch (error) {
        console.error('Error fetching properties:', error);
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [currentLocation]);

  // Apply filters when searchFilters or properties change
  useEffect(() => {
    if (properties.length > 0) {
      let filtered = properties;
      
      // Apply basic filters if needed
      if (searchFilters.propertyType && searchFilters.propertyType !== 'all') {
        filtered = filtered.filter(property => 
          property.subCategory && property.subCategory.name && 
          property.subCategory.name.toLowerCase().includes(searchFilters.propertyType.toLowerCase())
        );
      }
      
      if (searchFilters.budgetRange) {
        const { min, max } = searchFilters.budgetRange;
        filtered = filtered.filter(property => {
          if (min && property.price < parseInt(min)) return false;
          if (max && property.price > parseInt(max)) return false;
          return true;
        });
      }
      
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
