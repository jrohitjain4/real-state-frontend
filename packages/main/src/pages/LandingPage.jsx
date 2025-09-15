import React, { useState, useEffect } from "react";
import { LocationProvider } from "../contexts/LocationContext";
import { Navigation } from "../landing/components/navigation";
import { Header } from "../landing/components/header";
import PropertyListing from "../landing/components/PropertyListing/PropertyListing";
import { Features } from "../landing/components/features";
import { About } from "../landing/components/about";
import { Services } from "../landing/components/services";
import { Gallery } from "../landing/components/gallery";
import { Testimonials } from "../landing/components/testimonials";
import { Team } from "../landing/components/Team";
import { Contact } from "../landing/components/contact";
import JsonData from "../landing/data/data.json";
import SmoothScroll from "smooth-scroll";

export const scroll = new SmoothScroll('a[href*="#"]', {
  speed: 1000,
  speedAsDuration: true,
});

const LandingPage = () => {
  const [landingPageData, setLandingPageData] = useState({});
  const [searchFilters, setSearchFilters] = useState({});
  
  useEffect(() => {
    setLandingPageData(JsonData);
  }, []);
  const handleSearch = (searchData) => {
    console.log('Search Data:', searchData);
    // Handle search logic here
    // You can navigate to search results page or update state
      // Update search filters for PropertyListing
      setSearchFilters({
        tab: searchData.tab,
        propertyType: searchData.propertyType,
        propertySubType: searchData.propertySubType,
        budgetRange: searchData.budgetRange,
        searchQuery: searchData.searchQuery
      });
      
      // Scroll to property listing section
      const propertySection = document.getElementById('property-listing');
      if (propertySection) {
        propertySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
  };

  return (
    <LocationProvider>
      <div>
        <Navigation />
        <Header />
        <section id="property-listing" className="property-section">
          <PropertyListing searchFilters={searchFilters} />
        </section>
        <Features data={landingPageData.Features} />
        <About data={landingPageData.About} />
        <Services data={landingPageData.Services} />
        <Gallery data={landingPageData.Gallery} />
        <Testimonials data={landingPageData.Testimonials} />
        <Team data={landingPageData.Team} />
        <Contact data={landingPageData.Contact} />
      </div>
    </LocationProvider>
  );
};

export default LandingPage;