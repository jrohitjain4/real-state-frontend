// components/PropertySearchFilter/PropertySearchFilter.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from '../../../contexts/LocationContext';
import './PropertySearchFilter.css';

// Import the same MOCK_LOCATIONS (later ye API se aayega)
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
  
  // Other Cities (add rest of cities here)
  { id: 23, name: 'Agra' },
  { id: 24, name: 'Ahmadnagar' },
  // ... add all other cities
];

const PROPERTY_TYPES = [
  { id: 1, value: 'flat', label: 'Flat', options: ['+1 BHK', '+2 BHK', '+3 BHK', '+4 BHK', '+5 BHK'] },
  { id: 2, value: 'house', label: 'House/Villa', options: ['+1 BHK', '+2 BHK', '+3 BHK', '+4 BHK', '+5 BHK'] },
  { id: 3, value: 'plot', label: 'Plot' },
  { id: 4, value: 'commercial', label: 'Commercial', options: ['Office Space', 'Shop/Showroom', 'Warehouse', 'Coworking'] },
  { id: 5, value: 'pg', label: 'PG', options: ['Boys', 'Girls', 'Both'] }
];

const BUDGET_OPTIONS = {
  buy: [
    { label: '₹ 5 Lac', value: '500000' },
    { label: '₹ 10 Lac', value: '1000000' },
    { label: '₹ 20 Lac', value: '2000000' },
    { label: '₹ 30 Lac', value: '3000000' },
    { label: '₹ 40 Lac', value: '4000000' },
    { label: '₹ 50 Lac', value: '5000000' },
    { label: '₹ 60 Lac', value: '6000000' },
    { label: '₹ 70 Lac', value: '7000000' },
    { label: '₹ 80 Lac', value: '8000000' },
    { label: '₹ 90 Lac', value: '9000000' },
    { label: '₹ 1 Cr', value: '10000000' },
    { label: '₹ 1.5 Cr', value: '15000000' },
    { label: '₹ 2 Cr', value: '20000000' },
    { label: '₹ 3 Cr', value: '30000000' },
    { label: '₹ 5 Cr', value: '50000000' },
    { label: '₹ 10 Cr', value: '100000000' }
  ],
  rent: [
    { label: '₹ 5,000', value: '5000' },
    { label: '₹ 10,000', value: '10000' },
    { label: '₹ 15,000', value: '15000' },
    { label: '₹ 20,000', value: '20000' },
    { label: '₹ 25,000', value: '25000' },
    { label: '₹ 30,000', value: '30000' },
    { label: '₹ 40,000', value: '40000' },
    { label: '₹ 50,000', value: '50000' },
    { label: '₹ 60,000', value: '60000' },
    { label: '₹ 70,000', value: '70000' },
    { label: '₹ 80,000', value: '80000' },
    { label: '₹ 90,000', value: '90000' },
    { label: '₹ 1 Lac', value: '100000' },
    { label: '₹ 1.5 Lac', value: '150000' },
    { label: '₹ 2 Lac', value: '200000' }
  ]
};

const PropertySearchFilter = ({ onSearch}) => {
  const { currentLocation, setCurrentLocation } = useLocation();
  const [activeTab, setActiveTab] = useState('buy');
  const [propertyType, setPropertyType] = useState('flat');
  const [propertySubType, setPropertySubType] = useState('+1 BHK');
  const [budgetRange, setBudgetRange] = useState({ min: '', max: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [showPropertyDropdown, setShowPropertyDropdown] = useState(false);
  const [showBudgetDropdown, setShowBudgetDropdown] = useState(false);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  
  const propertyDropdownRef = useRef(null);
  const budgetDropdownRef = useRef(null);
  const searchContainerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (propertyDropdownRef.current && !propertyDropdownRef.current.contains(event.target)) {
        setShowPropertyDropdown(false);
      }
      if (budgetDropdownRef.current && !budgetDropdownRef.current.contains(event.target)) {
        setShowBudgetDropdown(false);
      }
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setShowLocationSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    // Filter locations based on input
    if (value.trim()) {
      const filtered = MOCK_LOCATIONS.filter(location =>
        location.name.toLowerCase().includes(value.toLowerCase())
      );
      setLocationSuggestions(filtered);
      setShowLocationSuggestions(filtered.length > 0);
    } else {
      setLocationSuggestions([]);
      setShowLocationSuggestions(false);
    }
  };

  const handleLocationSelect = (location) => {
    // Update parent component's location
    setCurrentLocation(location);
    
    // Clear search and hide suggestions
    setSearchQuery('');
    setShowLocationSuggestions(false);
    setLocationSuggestions([]);
  };

  const handleSearch = () => {
    const searchData = {
      tab: activeTab,
      location: currentLocation,
      propertyType,
      propertySubType,
      budgetRange,
      searchQuery
    };
    
    onSearch(searchData);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    // Reset selections when tab changes
    setPropertyType(tab === 'pg' ? 'pg' : 'flat');
    setPropertySubType(tab === 'pg' ? 'Boys' : '+1 BHK');
    setBudgetRange({ min: '', max: '' });
  };

  const getCurrentPropertyType = () => {
    const type = PROPERTY_TYPES.find(t => t.value === propertyType);
    if (type && propertySubType) {
      return `${type.label} ${propertySubType}`;
    }
    return type ? type.label : 'Property Type';
  };

  const getBudgetDisplay = () => {
    if (budgetRange.min || budgetRange.max) {
      if (budgetRange.min && budgetRange.max) {
        return `₹${formatBudget(budgetRange.min)} - ₹${formatBudget(budgetRange.max)}`;
      } else if (budgetRange.min) {
        return `Above ₹${formatBudget(budgetRange.min)}`;
      } else {
        return `Upto ₹${formatBudget(budgetRange.max)}`;
      }
    }
    return 'Budget';
  };

  const formatBudget = (value) => {
    const num = parseInt(value);
    if (num >= 10000000) {
      return `${(num / 10000000).toFixed(1)} Cr`;
    } else if (num >= 100000) {
      return `${(num / 100000).toFixed(1)} Lac`;
    } else {
      return num.toLocaleString('en-IN');
    }
  };

  const tabs = [
    { id: 'buy', label: 'Buy' },
    { id: 'rent', label: 'Rent' },
    { id: 'new-projects', label: 'New Projects' },
    { id: 'pg', label: 'PG' },
    { id: 'plot', label: 'Plot' },
    { id: 'commercial', label: 'Commercial' },
    { id: 'luxury', label: 'Luxury' }
  ];

  return (
    <div className="property-search-container">
      <h1 className="search-title">
        Start your <span className="hashtag">#PataBadloLifeBadlo</span> Journey
      </h1>
      
      <div className="search-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => handleTabChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="search-filters">
        {/* Combined Search Input with Location Display */}
        <div className="filter-item search-input-container" ref={searchContainerRef}>
          <div className="location-display">
            <i className="fa fa-map-marker"></i>
            <span className="selected-location">{currentLocation.name}</span>
          </div>
          <div className="search-wrapper">
            <i className="fa fa-search search-icon"></i>
            <input
              type="text"
              placeholder="Search City, Locality, Project"
              value={searchQuery}
              onChange={handleSearchInputChange}
              className="search-input"
            />
          </div>
          
          {/* Location Suggestions Dropdown */}
          {showLocationSuggestions && (
            <div className="location-suggestions">
              {locationSuggestions.map(location => (
                <div
                  key={location.id}
                  className="suggestion-item"
                  onClick={() => handleLocationSelect(location)}
                >
                  <i className="fa fa-map-marker"></i>
                  <span>{location.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Property Type Dropdown */}
        <div className="filter-item property-dropdown" ref={propertyDropdownRef}>
          <button 
            className="dropdown-button"
            onClick={() => setShowPropertyDropdown(!showPropertyDropdown)}
            type='button'
          >
            <i className="fa fa-home"></i>
            <span>{getCurrentPropertyType()}</span>
            <i className={`fa fa-chevron-${showPropertyDropdown ? 'up' : 'down'}`}></i>
          </button>

          {showPropertyDropdown && (
            <div className="dropdown-menu property-menu">
              {PROPERTY_TYPES.map(type => (
                <div key={type.id} className="property-type-section">
                  <div 
                    className={`property-type-header ${propertyType === type.value ? 'active' : ''}`}
                    onClick={() => {
                      setPropertyType(type.value);
                      if (!type.options) {
                        setPropertySubType('');
                        setShowPropertyDropdown(false);
                      }
                    }}
                  >
                    {type.label}
                  </div>
                  {type.options && propertyType === type.value && (
                    <div className="property-options">
                      {type.options.map(option => (
                        <label key={option} className="option-label">
                          <input
                            type="radio"
                            name="propertySubType"
                            value={option}
                            checked={propertySubType === option}
                            onChange={(e) => {
                              setPropertySubType(e.target.value);
                              setShowPropertyDropdown(false);
                            }}
                          />
                          <span>{option}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Budget Dropdown */}
        <div className="filter-item budget-dropdown" ref={budgetDropdownRef}>
          <button 
            className="dropdown-button"
            onClick={() => setShowBudgetDropdown(!showBudgetDropdown)}
          >
            <i className="fa fa-rupee"></i>
            <span>{getBudgetDisplay()}</span>
            <i className={`fa fa-chevron-${showBudgetDropdown ? 'up' : 'down'}`}></i>
          </button>

          {showBudgetDropdown && (
            <div className="dropdown-menu budget-menu">
              <div className="budget-selectors">
                <div className="budget-column">
                  <label>Min</label>
                  <select 
                    value={budgetRange.min}
                    onChange={(e) => setBudgetRange({...budgetRange, min: e.target.value})}
                  >
                    <option value="">Min</option>
                    {BUDGET_OPTIONS[activeTab === 'rent' ? 'rent' : 'buy'].map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="budget-column">
                  <label>Max</label>
                  <select 
                    value={budgetRange.max}
                    onChange={(e) => setBudgetRange({...budgetRange, max: e.target.value})}
                  >
                    <option value="">Max</option>
                    {BUDGET_OPTIONS[activeTab === 'rent' ? 'rent' : 'buy'].map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <button 
                className="budget-apply-btn"
                onClick={() => setShowBudgetDropdown(false)}
              >
                Apply
              </button>
            </div>
          )}
        </div>

        {/* Search Button */}
        <button className="search-button" onClick={handleSearch}>
          <i className="fa fa-search"></i>
          <span>Search</span>
        </button>
      </div>
    </div>
  );
};

export default PropertySearchFilter;