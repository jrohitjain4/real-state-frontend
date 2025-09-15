// components/LocationSelector/LocationSelector.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from '../../../contexts/LocationContext';
import './LocationSelector.css';

const MOCK_LOCATIONS = [
  // Nearby Cities
  { id: 1, name: 'Bangalore - East', nearby: true },
  { id: 2, name: 'Bangalore - South', nearby: true },
  { id: 3, name: 'Bangalore - West', nearby: true },
  { id: 4, name: 'Bangalore - Central', nearby: true },
  { id: 5, name: 'Bangalore - North', nearby: true },
  
  // Popular Cities
  { id: 6, name: 'Ahmedabad', popular: true },
  { id: 7, name: 'Bangalore', popular: true },
  { id: 8, name: 'Beyond Thane', popular: true },
  { id: 9, name: 'Chennai', popular: true },
  { id: 10, name: 'Gurgaon', popular: true },
  { id: 11, name: 'Hyderabad', popular: true },
  { id: 12, name: 'Indore', popular: true },
  { id: 13, name: 'Jaipur', popular: true },
  { id: 14, name: 'Kolkata', popular: true },
  { id: 15, name: 'Lucknow', popular: true },
  { id: 16, name: 'Mumbai', popular: true },
  { id: 17, name: 'Navi Mumbai', popular: true },
  { id: 18, name: 'New Delhi', popular: true },
  { id: 19, name: 'Noida', popular: true },
  { id: 20, name: 'Pune', popular: true },
  { id: 21, name: 'Thane', popular: true },
  
  // Other Cities
  { id: 23, name: 'Agra' },
  { id: 24, name: 'Ahmadnagar' },
  { id: 25, name: 'Allahabad' },
  { id: 26, name: 'Aluva' },
  { id: 27, name: 'Amritsar' },
  { id: 28, name: 'Aurangabad' },
  { id: 29, name: 'Badlapur' },
  { id: 30, name: 'Bareilly' },
  { id: 31, name: 'Belgaum' },
  { id: 32, name: 'Bhiwadi' },
  { id: 33, name: 'Bhiwandi' },
  { id: 34, name: 'Bhopal' },
  { id: 35, name: 'Bhubaneswar' },
  { id: 36, name: 'Bokaro Steel City' },
  { id: 37, name: 'Chandigarh' },
  { id: 38, name: 'Chengalpattu' },
  { id: 39, name: 'Coimbatore' },
  { id: 40, name: 'Dehradun' },
  { id: 41, name: 'Durgapur' },
  { id: 42, name: 'Ernakulam' },
  { id: 43, name: 'Erode' },
  { id: 44, name: 'Faridabad' },
  { id: 45, name: 'Ghaziabad' },
  { id: 46, name: 'Goa' },
  { id: 47, name: 'Gorakhpur' },
  { id: 48, name: 'Greater Noida' },
  { id: 49, name: 'Guntur' },
  { id: 50, name: 'Guwahati' },
  { id: 51, name: 'Gwalior' },
  { id: 52, name: 'Haridwar' },
  { id: 53, name: 'Hosur' },
  { id: 54, name: 'Hubli' },
  { id: 55, name: 'Jabalpur' },
  { id: 56, name: 'Jalandhar' },
  { id: 57, name: 'Jammu' },
  { id: 58, name: 'Jamshedpur' },
  { id: 59, name: 'Jodhpur' },
  { id: 60, name: 'Kalyan' },
  { id: 61, name: 'Kannur' },
  { id: 62, name: 'Kanpur' },
  { id: 63, name: 'Khopoli' },
  { id: 64, name: 'Kochi' },
  { id: 65, name: 'Kodaikanal' },
  { id: 66, name: 'Kottayam' },
  { id: 67, name: 'Kozhikode' },
  { id: 68, name: 'Lonavala' },
  { id: 69, name: 'Ludhiana' },
  { id: 70, name: 'Madurai' },
  { id: 71, name: 'Mangalore' },
  { id: 72, name: 'Mohali' },
  { id: 73, name: 'Mysore' },
  { id: 74, name: 'Nagpur' },
  { id: 75, name: 'Nainital' },
  { id: 76, name: 'Nanded' },
  { id: 77, name: 'Nashik' },
  { id: 78, name: 'Navsari' },
  { id: 79, name: 'Nellore' },
  { id: 80, name: 'Newtown' },
  { id: 81, name: 'Ooty' },
  { id: 82, name: 'Palakkad' },
  { id: 83, name: 'Palghar' },
  { id: 84, name: 'Panchkula' },
  { id: 85, name: 'Patiala' },
  { id: 86, name: 'Patna' },
  { id: 87, name: 'Pondicherry' },
  { id: 88, name: 'Raipur' },
  { id: 89, name: 'Rajahmundry' },
  { id: 90, name: 'Ranchi' },
  { id: 91, name: 'Salem' },
  { id: 92, name: 'Satara' },
  { id: 93, name: 'Shimla' },
  { id: 94, name: 'Siliguri' },
  { id: 95, name: 'Solapur' },
  { id: 96, name: 'Sonipat' },
  { id: 97, name: 'Surat' },
  { id: 98, name: 'Thanjavur' },
  { id: 99, name: 'Thrissur' },
  { id: 100, name: 'Tirunelveli' },
  { id: 101, name: 'Tirupati' },
  { id: 102, name: 'Tirupur' },
  { id: 103, name: 'Trichy' },
  { id: 104, name: 'Trivandrum' },
  { id: 105, name: 'Tumkur' },
  { id: 106, name: 'Udaipur' },
  { id: 107, name: 'Udupi' },
  { id: 108, name: 'Vadodara' },
  { id: 109, name: 'Vapi' },
  { id: 110, name: 'Varanasi' },
  { id: 111, name: 'Vijayawada' },
  { id: 112, name: 'Visakhapatnam' },
  { id: 113, name: 'Vrindavan' },
  { id: 114, name: 'Zirakpur' }
];

const LocationSelector = () => {
  const { currentLocation, setCurrentLocation } = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredLocations, setFilteredLocations] = useState(MOCK_LOCATIONS);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (value) => {
    setSearchTerm(value);
    
    if (value.trim() === '') {
      setFilteredLocations(MOCK_LOCATIONS);
    } else {
      const filtered = MOCK_LOCATIONS.filter(location =>
        location.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredLocations(filtered);
    }
  };

  const handleLocationSelect = (location) => {
    setCurrentLocation(location);
    setIsOpen(false);
    setSearchTerm('');
    setFilteredLocations(MOCK_LOCATIONS);
  };

  const nearbyLocations = filteredLocations.filter(loc => loc.nearby);
  const popularCities = filteredLocations.filter(loc => loc.popular);
  const otherCities = filteredLocations.filter(loc => !loc.nearby && !loc.popular);

  return (
    <div className="location-selector" ref={dropdownRef}>
      <button 
        className="location-trigger"
        onClick={() => setIsOpen(!isOpen)}
        type="button"
      >
        <i className="fa fa-map-marker"></i>
        <span className="current-location">{currentLocation.name}</span>
        <i className={`fa fa-chevron-${isOpen ? 'up' : 'down'}`}></i>
      </button>

      {isOpen && (
        <div className="location-dropdown">
          {/* Search Bar */}
          <div className="location-search-container">
            <i className="fa fa-search"></i>
            <input
              type="text"
              placeholder="Search for city"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="location-search-input"
              autoFocus
            />
          </div>

          <div className="location-content">
            {/* INDIA Header */}
            <div className="india-header">
              <i className="fa fa-map-marker"></i>
              <span>INDIA</span>
            </div>

            {/* Nearby Cities */}
            {nearbyLocations.length > 0 && (
              <div className="location-section">
                <h3 className="section-title">Nearby Cities</h3>
                <div className="cities-row">
                  {nearbyLocations.map(location => (
                    <span
                      key={location.id}
                      className="city-item"
                      onClick={() => handleLocationSelect(location)}
                    >
                      {location.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Popular Cities */}
            {popularCities.length > 0 && (
              <div className="location-section">
                <h3 className="section-title">Popular Cities</h3>
                <div className="cities-grid-3">
                  {popularCities.map(location => (
                    <span
                      key={location.id}
                      className="city-item"
                      onClick={() => handleLocationSelect(location)}
                    >
                      {location.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Other Cities */}
            {otherCities.length > 0 && (
              <div className="location-section">
                <h3 className="section-title">Other Cities</h3>
                <div className="cities-grid-5">
                  {otherCities.map(location => (
                    <span
                      key={location.id}
                      className="city-item"
                      onClick={() => handleLocationSelect(location)}
                    >
                      {location.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* No Results */}
            {searchTerm && filteredLocations.length === 0 && (
              <div className="no-results">
                <i className="fa fa-search"></i>
                <p>No cities found matching "{searchTerm}"</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationSelector;