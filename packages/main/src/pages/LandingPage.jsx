import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LocationProvider } from "../contexts/LocationContext";
import { Navigation } from "../landing/components/navigation";
import { Header } from "../landing/components/header";
import PropertyCategories from "../landing/components/PropertyCategories/PropertyCategories";
import PropertyCarousel from "../landing/components/PropertyCarousel/PropertyCarousel";

import JsonData from "../landing/data/data.json";
import SmoothScroll from "smooth-scroll";
import CityProperties from "../landing/components/CITES/CityProperties";
  import BenefitsSection from "../landing/components/Benefits/BenefitsSection";
import ContactPage from "../landing/components/Contact/ContactPage";
import Footer from "../landing/components/Footer/Footer";
export const scroll = new SmoothScroll('a[href*="#"]', {
  speed: 1000,
  speedAsDuration: true,
}); 

const LandingPage = () => {
  const navigate = useNavigate();
  const [landingPageData, setLandingPageData] = useState({});
  const [searchFilters] = useState({});
  
  useEffect(() => {
    setLandingPageData(JsonData);
  }, []);
  
  const handleSearch = (searchData) => {
    console.log('🔍 Landing Search Data:', searchData);
    
    // Build query parameters for properties page
    const queryParams = new URLSearchParams();
    
    // Add category filter based on tab
    if (searchData.tab === 'buy') {
      queryParams.set('categoryId', '1');
    } else if (searchData.tab === 'rent') {
      queryParams.set('categoryId', '2');
    } else if (searchData.tab === 'pg') {
      queryParams.set('categoryId', '3');
    }
    
    // Add city filter from search query or selected location
    if (searchData.searchQuery && searchData.searchQuery.trim()) {
      queryParams.set('city', searchData.searchQuery.trim());
    } else if (searchData.location && searchData.location.name && searchData.location.name !== 'Bangalore') {
      queryParams.set('city', searchData.location.name);
    }
    
    // Add property type filter
    if (searchData.propertyType && searchData.propertyType !== 'all') {
      if (searchData.propertyType === '1bhk') {
        queryParams.set('bedrooms', '1');
      } else if (searchData.propertyType === '2bhk') {
        queryParams.set('bedrooms', '2');
      } else if (searchData.propertyType === '3bhk') {
        queryParams.set('bedrooms', '3');
      }
    }
    
    // Add budget filter
    if (searchData.budgetRange && searchData.budgetRange !== 'all') {
      const budgetRanges = {
        'under-50': { max: 5000000 },
        '50-100': { min: 5000000, max: 10000000 },
        '100-200': { min: 10000000, max: 20000000 },
        'above-200': { min: 20000000 }
      };
      
      const range = budgetRanges[searchData.budgetRange];
      if (range) {
        if (range.min) queryParams.set('minPrice', range.min);
        if (range.max) queryParams.set('maxPrice', range.max);
      }
    }
    
    // Navigate to properties page with filters
    const queryString = queryParams.toString();
    const propertiesUrl = queryString ? `/properties?${queryString}` : '/properties';
    
    console.log('🚀 Redirecting to:', propertiesUrl);
    navigate(propertiesUrl);
  };

  return (
    <LocationProvider>
      <div>
        <Navigation />
        <Header onSearch={handleSearch} />
        <PropertyCategories />
        <section id="property-listing" className="property-section">
          <CityProperties />
        </section>

        <PropertyCarousel />
        <BenefitsSection />
       
        
        
         <ContactPage />
         <Footer />
      </div>
    </LocationProvider>
  );
};

export default LandingPage;
