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
  
  const handleSearch = async (searchData) => {
    console.log('🔍 Landing Search Data:', searchData);
    
    // Build query parameters for properties page
    const queryParams = new URLSearchParams();
    
    // Map tab to category: buy → sell, rent → rent, lease → lease
    // Note: "Buy" means properties for sale/sell, so we use Sell category
    let categorySlug = '';
    if (searchData.tab === 'buy') {
      categorySlug = 'sell'; // Buy means purchasing properties that are for sale
    } else if (searchData.tab === 'rent') {
      categorySlug = 'rent';
    } else if (searchData.tab === 'lease') {
      categorySlug = 'lease';
    }
    
    // Fetch category ID from API based on slug
    try {
      const response = await fetch('http://localhost:5000/api/categories');
      const data = await response.json();
      if (data.success && data.data) {
        const category = data.data.find(cat => cat.slug === categorySlug);
        if (category) {
          queryParams.set('categoryId', category.id);
          
          // Add property_for filter based on property type
          // Commercial/Residential is determined by property_for field in database
          if (searchData.propertyType) {
            if (searchData.propertyType === 'commercial') {
              queryParams.set('property_for', 'commercial');
            } else if (searchData.propertyType === 'residential') {
              queryParams.set('property_for', 'residential');
            } else if (searchData.propertyType === 'flat') {
              queryParams.set('property_for', 'residential');
              // Also add subcategory for flat
              const flatSubcat = category.subcategories?.find(sub => 
                sub.name.toLowerCase() === 'flats'
              );
              if (flatSubcat) {
                queryParams.set('subCategoryId', flatSubcat.id);
              }
            } else if (searchData.propertyType === 'pg') {
              queryParams.set('property_for', 'residential');
              // Also add subcategory for PG
              const pgSubcat = category.subcategories?.find(sub => 
                sub.name.toLowerCase().includes('pg')
              );
              if (pgSubcat) {
                queryParams.set('subCategoryId', pgSubcat.id);
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
    
    // Add city filter from search query or selected location
    if (searchData.searchQuery && searchData.searchQuery.trim()) {
      queryParams.set('city', searchData.searchQuery.trim());
    } else if (searchData.location && searchData.location.name && searchData.location.name !== 'Bangalore') {
      queryParams.set('city', searchData.location.name);
    }
    
    // Add budget filter
    if (searchData.budgetRange && (searchData.budgetRange.min || searchData.budgetRange.max)) {
      if (searchData.budgetRange.min) {
        queryParams.set('minPrice', searchData.budgetRange.min);
      }
      if (searchData.budgetRange.max) {
        queryParams.set('maxPrice', searchData.budgetRange.max);
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
