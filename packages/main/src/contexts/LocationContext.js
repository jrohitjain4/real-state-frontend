// contexts/LocationContext.js
import React, { createContext, useState, useContext } from 'react';

const LocationContext = createContext();

// Default location
const DEFAULT_LOCATION = {
  id: 7,
  name: 'Bangalore',
  popular: true
};

export const LocationProvider = ({ children }) => {
  const [currentLocation, setCurrentLocation] = useState(DEFAULT_LOCATION);

  const value = {
    currentLocation,
    setCurrentLocation
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};

// Custom hook for using location context
export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within LocationProvider');
  }
  return context;
};