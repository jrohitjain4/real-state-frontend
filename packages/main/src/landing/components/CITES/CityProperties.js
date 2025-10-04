// CityProperties.jsx
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { cityPropertyCounts } from '../../../data/dummyProperties';
import './cityProperties.css';

const CityProperties = () => {
  const navigate = useNavigate();
  const headerRef = useRef(null);
  const gridRef = useRef(null);
  const buttonRef = useRef(null);
  const [propertyCounts, setPropertyCounts] = useState({});
  const [loading, setLoading] = useState(true);

  const neighborhoods = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=500&fit=crop',
      listings: '4+ Listing',
      location: 'Indore',
      size: 'large'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=240&fit=crop',
      listings: '4+ Listing',
      location: 'Delhi',
      size: 'small'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=240&fit=crop',
      listings: '4+ Listing',
      location: 'Mumbyeh ai',
      size: 'small'
    },
    {
      id: 4,
      image: 'https://images.pexels.com/photos/6489083/pexels-photo-6489083.jpeg?auto=compress&cs=tinysrgb&w=600',
      listings: '4+ Listing',
      location: 'Bhopal',
      size: 'small'
    },
    {
      id: 5,
      image: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=400&h=240&fit=crop',
      listings: '4+ Listing',
      location: 'Gurgaon',
      size: 'small'
    },
    {
      id: 6,
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=500&fit=crop',
      listings: '4+ Listing',
      location: 'Pune',
      size: 'large'
    }
  ];

  // Function to fetch property counts for each city
  const fetchPropertyCounts = async () => {
    try {
      setLoading(true);
      const counts = {};
      
      // Fetch real property counts for each city from backend
      for (const city of neighborhoods) {
        try {
          const response = await fetch(`http://localhost:5000/api/properties/count-by-city?city=${encodeURIComponent(city.location)}`);
          const data = await response.json();
          
          console.log(`Count API Response for ${city.location}:`, data);
          
          if (data.success && data.data) {
            counts[city.location] = data.data.count || 0;
          } else {
            counts[city.location] = 0;
          }
        } catch (error) {
          console.error(`Error fetching count for ${city.location}:`, error);
          counts[city.location] = 0;
        }
      }
      
      setPropertyCounts(counts);
    } catch (error) {
      console.error('Error fetching property counts:', error);
      // Set zero counts if everything fails
      const zeroCounts = {};
      neighborhoods.forEach(n => {
        zeroCounts[n.location] = 0;
      });
      setPropertyCounts(zeroCounts);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle city click
  const handleCityClick = (cityName) => {
    console.log(`Clicked on city: ${cityName}`);
   
    const url = `/properties?city=${encodeURIComponent(cityName)}`;
    console.log(`Navigating to: ${url}`);
    navigate(url);
  };

  useEffect(() => {
    fetchPropertyCounts();
  }, []);

  useEffect(() => {
    // Set initial state for animations
    gsap.set([headerRef.current.children, '.neighborhood-card', buttonRef.current], { autoAlpha: 0 });
    gsap.set(headerRef.current.children, { y: -30 });
    gsap.set('.neighborhood-card', { scale: 0.9 });
    gsap.set(buttonRef.current, { y: 30 });
    
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // Animate header, cards, and button
    tl.to(headerRef.current.children, {
      y: 0,
      autoAlpha: 1,
      duration: 0.8,
      stagger: 0.2,
    })
    .to('.neighborhood-card', {
      scale: 1,
      autoAlpha: 1,
      duration: 0.6,
      stagger: 0.08,
    }, '-=0.6')
    .to(buttonRef.current, {
      y: 0,
      autoAlpha: 1,
      duration: 0.6,
    }, '-=0.4');

    // Hover effects
    const cards = document.querySelectorAll('.neighborhood-card');
    cards.forEach(card => {
      const image = card.querySelector('img');
      
      card.addEventListener('mouseenter', () => {
        gsap.to(image, { scale: 1.05, duration: 0.4, ease: 'power2.out' });
      });
      
      card.addEventListener('mouseleave', () => {
        gsap.to(image, { scale: 1, duration: 0.4, ease: 'power2.out' });
      });
    });

  }, []);

  return (
    <div className="explore-neighborhood">
      <div className="neighborhood-container">
        <header ref={headerRef} className="neighborhood-header">
          <a href="#" className="view-listings">View All 329 New Listings</a>
          <h1 className="main-title">Explore a Neighborhood or City</h1>
        </header>

        <div ref={gridRef} className="neighborhoods-grid">
          {neighborhoods.map((item) => (
            <div 
              key={item.id} 
              className={`neighborhood-card ${item.size === 'large' ? 'large-card' : 'small-card'}`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log(`Card clicked for: ${item.location}`);
                handleCityClick(item.location);
              }}
              style={{ cursor: 'pointer', pointerEvents: 'auto' }}
            >
              <img src={item.image} alt={item.location} />
              <div className="card-overlay"></div>
              <div className="card-content">
                <span className="listing-tag">
                  {loading ? '...' : `${propertyCounts[item.location] || 0} Properties`}
                </span>
                <h3 className="location-name">{item.location}</h3>
              </div>
            </div>
          ))}
        </div>

        <div className="button-wrapper">
          <button 
            ref={buttonRef} 
            className="see-all-btn"
            onClick={() => navigate('/properties')}
          >
            See all Cities
          </button>
        </div>
      </div>
    </div>
  );
};

export default CityProperties;