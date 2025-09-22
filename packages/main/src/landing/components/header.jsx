// landing/components/header.jsx
import React from 'react';
import PropertySearchFilter from './PropertySearchFilter/PropertySearchFilter';
import PropertyListing from './PropertyListing/PropertyListing';
import BackgroundCarousel from './BackgroundCarousel/BackgroundCarousel';

export const Header = ({ data, onSearch }) => {
  const handleSearch = (searchData) => {
    console.log('Search clicked with data:', searchData);
    if (onSearch) {
      onSearch(searchData);
    }
  };

  return (
    <header id="header">
      <div className="intro">
        <BackgroundCarousel />
        <div className="overlay">
          <div className="container">
            <div className="row">
              <div className="col-md-12 intro-text">
                <PropertySearchFilter onSearch={handleSearch} />
                {data && (
                  <>
                    <h1>{data.title}</h1>
                    <p>{data.paragraph}</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};