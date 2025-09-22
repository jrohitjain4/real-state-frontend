// components/PropertyCategories/PropertyCategories.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { propertyCategoriesAPI } from '../../../api/propertyCategories';
import './PropertyCategories.css';

// Importing icons from react-icons
import {
  BsBuilding,
  BsHouseDoor,
  BsEnvelope,
  BsBriefcase,
  BsShop,
  BsArchive
} from 'react-icons/bs';
import { GiHouse } from 'react-icons/gi';
import { IoBedOutline } from 'react-icons/io5';

// Property categories with updated icons and data to match the image
const propertyCategories = [
  {
    id: 'storage',
    name: 'Storage',
    icon: <BsArchive />,
    categoryId: 4, // Sell category (since Buy navigation shows Sell properties)
    subcategoryName: 'Godown' // Match the actual subcategory name in database
  },
  {
    id: 'flats',
    name: 'Flats',
    icon: <BsBuilding />,
    categoryId: 4, // Sell category
    subcategoryName: 'Flats'
  },
  {
    id: 'farmhouse',
    name: 'Farmhouse',
    icon: <GiHouse />,
    categoryId: 4, // Sell category
    subcategoryName: 'Farmhouse'
  },
  {
    id: 'plot',
    name: 'Plot / Land',
    icon: <BsEnvelope />,
    categoryId: 4, // Sell category
    subcategoryName: 'Plot/Land'
  },
  {
    id: 'pg',
    name: 'PG / Co Living',
    icon: <IoBedOutline />,
    categoryId: 3, // Rent category
    subcategoryName: 'PG/Coliving'
  },
  {
    id: 'villa',
    name: 'Houses / Villa',
    icon: <BsHouseDoor />,
    categoryId: 4, // Sell category
    subcategoryName: 'House'
  },
  {
    id: 'office',
    name: 'Offices',
    icon: <BsBriefcase />,
    categoryId: 4, // Sell category
    subcategoryName: 'Offices'
  }];


const PropertyCategories = () => {
  const navigate = useNavigate();
  const [propertyCounts, setPropertyCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // State to track the active category, default to 'flats' as in the image
  const [activeCategory, setActiveCategory] = useState('flats');

  // Fetch property counts from backend
  useEffect(() => {
    const fetchPropertyCounts = async () => {
      try {
        setLoading(true);
        const counts = await propertyCategoriesAPI.getAllPropertyCounts(propertyCategories);
        setPropertyCounts(counts);
      } catch (error) {
        console.error('Error fetching property counts:', error);
        setError('Failed to load property counts');
        const zeroCounts = {};
        propertyCategories.forEach(cat => {
          zeroCounts[cat.id] = 0;
        });
        setPropertyCounts(zeroCounts);
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyCounts();
  }, []);

  const handleCategoryClick = async (category) => {
    // Set the clicked category as active
    setActiveCategory(category.id);
    
    try {
      // Get subcategory ID from backend
      const response = await fetch('http://localhost:5000/api/categories');
      const data = await response.json();
      
      if (data.success) {
        const categoryData = data.data.find(cat => cat.id === category.categoryId);
        if (categoryData && categoryData.subcategories) {
          const subcategory = categoryData.subcategories.find(sub => sub.name === category.subcategoryName);
          if (subcategory) {
            // Navigate to properties page with category filter
            const queryParams = new URLSearchParams();
            queryParams.set('category', category.categoryId);
            queryParams.set('subcategory', subcategory.id);
            
            // Determine property_for based on subcategory
            let propertyFor = 'residential';
            if (subcategory.propertyType === 'commercial' || 
                subcategory.propertyType === 'commercial-land' ||
                subcategory.name.toLowerCase().includes('godown') ||
                subcategory.name.toLowerCase().includes('land')) {
              propertyFor = 'commercial';
            }
            queryParams.set('property_for', propertyFor);
            
            navigate(`/properties?${queryParams.toString()}`);
            return;
          }
        }
      }
      
      // Fallback navigation without subcategory
      const queryParams = new URLSearchParams();
      queryParams.set('category', category.categoryId);
      navigate(`/properties?${queryParams.toString()}`);
    } catch (error) {
      console.error('Error fetching subcategory:', error);
      // Fallback navigation
      const queryParams = new URLSearchParams();
      queryParams.set('category', category.categoryId);
      navigate(`/properties?${queryParams.toString()}`);
    }
  };

  return (
    <div className="property-categories-section">
      <div className="container">
        <div className="section-header">
          <h2>Top Property Listings in India</h2>
          <p>
            <span className="highlight">Verified, Trusted</span> & Ready for You!
          </p>
        </div>
        
        {error ? (
          <div className="error-message">
            <p>Unable to load property counts. Please try again later.</p>
          </div>
        ) : (
          <div className="property-categories-container">
            {propertyCategories.map((category) => (
              <div 
                key={category.id}
                className={`property-category-card ${activeCategory === category.id ? 'active' : ''}`}
                onClick={() => handleCategoryClick(category)}
              >
                <div className="category-icon">
                  {category.icon}
                </div>
                <h3 className="category-name">{category.name}</h3>
                <p className="category-count">
                  {loading ? (
                    '...'
                  ) : (
                    `(${propertyCounts[category.id] || 0})`
                  )}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyCategories;