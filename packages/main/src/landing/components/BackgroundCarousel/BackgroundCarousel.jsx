import React, { useState, useEffect } from 'react';
import './BackgroundCarousel.css';

const BackgroundCarousel = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const images = [
    {
      url: '/pexels-charlotte-may-5824520.jpg',
      title: 'Modern Living Spaces'
    },
    {
      url: '/AdobeStock_563849704_Preview.jpeg',
      title: 'Beautiful Homes'
    },
    {
      url: '/1000_F_1126187916_wJD5loujGI5B6FDDSv1p2TRgxtpoForZ.jpg',
      title: 'Beautiful Homes'
    },
    {
      url: '/AdobeStock_1583247252_Preview.jpeg',
      title: 'Beautiful Homes'
    }
    
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 6000); // Change image every 6 seconds

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="background-carousel">
      {images.map((image, index) => (
        <div
          key={index}
          className={`carousel-slide ${index === currentImageIndex ? 'active' : ''}`}
          style={{
            backgroundImage: `url(${image.url})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />
      ))}
      <div className="carousel-overlay" />
      
      {/* Carousel Indicators */}
      <div className="carousel-indicators">
        {images.map((_, index) => (
          <button
            key={index}
            className={`indicator ${index === currentImageIndex ? 'active' : ''}`}
            onClick={() => setCurrentImageIndex(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default BackgroundCarousel;
