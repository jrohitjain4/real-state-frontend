// components/PropertyCategories/PropertyCategories.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { propertyCategoriesAPI } from '../../../api/propertyCategories';
import './PropertyCategories.css';

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination, EffectFade } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

// Importing icons - added FaWarehouse and MdOutlineVilla
import {
  BsBuilding,
  BsHouseDoor,
  BsBriefcase,
  BsShop,
  BsArchive,
  BsTextarea
} from 'react-icons/bs';
import { GiHouse } from 'react-icons/gi';
import { IoBedOutline } from 'react-icons/io5';
import { FaWarehouse } from 'react-icons/fa'; // <-- New Icon for Warehouse
import { MdOutlineVilla } from 'react-icons/md'; // <-- New Icon for Penthouse

// Property categories array with new additions
const propertyCategories = [
  {
    id: 'storage',
    name: 'Storage',
    icon: <BsArchive />,
    categoryId: 4,
    subcategoryName: 'Godown'
  },
  {
    id: 'flats',
    name: 'Flats',
    icon: <BsBuilding />,
    categoryId: 4,
    subcategoryName: 'Flats'
  },
  // --- NEW CATEGORY: PENTHOUSE ---
  {
    id: 'penthouse',
    name: 'Penthouse',
    icon: <MdOutlineVilla />,
    categoryId: 4, 
    subcategoryName: 'Penthouse' // Ensure this matches your backend subcategory
  },
  {
    id: 'farmhouse',
    name: 'Farmhouse',
    icon: <GiHouse />,
    categoryId: 4,
    subcategoryName: 'Farmhouse'
  },
  {
    id: 'plot',
    name: 'Plot / Land',
    icon: <BsTextarea />,
    categoryId: 4,
    subcategoryName: 'Plot/Land'
  },
  {
    id: 'pg',
    name: 'PG / Co Living',
    icon: <IoBedOutline />,
    categoryId: 3,
    subcategoryName: 'PG/Coliving'
  },
  {
    id: 'villa',
    name: 'Houses / Villa',
    icon: <BsHouseDoor />,
    categoryId: 4,
    subcategoryName: 'House'
  },
  {
    id: 'office',
    name: 'Offices',
    icon: <BsBriefcase />,
    categoryId: 4,
    subcategoryName: 'Offices'
  },
  {
    id: 'shops',
    name: 'Retail / Shops',
    icon: <BsShop />,
    categoryId: 4,
    subcategoryName: 'Shops'
  },
  // --- NEW CATEGORY: WAREHOUSE ---
  {
    id: 'warehouse',
    name: 'Warehouse',
    icon: <FaWarehouse />,
    categoryId: 4,
    subcategoryName: 'Warehouse' // Ensure this matches your backend subcategory
  }
];


const PropertyCategories = () => {
  const navigate = useNavigate();
  const [propertyCounts, setPropertyCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('flats');

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
    setActiveCategory(category.id);
    
    try {
      const response = await fetch('http://localhost:5000/api/categories');
      const data = await response.json();
      
      if (data.success) {
        const categoryData = data.data.find(cat => cat.id === category.categoryId);
        if (categoryData && categoryData.subcategories) {
          const subcategory = categoryData.subcategories.find(sub => sub.name === category.subcategoryName);
          if (subcategory) {
            const queryParams = new URLSearchParams();
            queryParams.set('category', category.categoryId);
            queryParams.set('subcategory', subcategory.id);
            
            let propertyFor = 'residential';
            if (['commercial', 'commercial-land'].includes(subcategory.propertyType) || 
                ['godown', 'land', 'warehouse'].some(term => subcategory.name.toLowerCase().includes(term))) {
              propertyFor = 'commercial';
            }
            queryParams.set('property_for', propertyFor);
            
            navigate(`/properties?${queryParams.toString()}`);
            return;
          }
        }
      }
      
      const queryParams = new URLSearchParams();
      queryParams.set('category', category.categoryId);
      navigate(`/properties?${queryParams.toString()}`);
    } catch (error) {
      console.error('Error fetching subcategory:', error);
      const queryParams = new URLSearchParams();
      queryParams.set('category', category.categoryId);
      navigate(`/properties?${queryParams.toString()}`);
    }
  };

  return (
    <div className="property-categories-section">
      <div className="container">
        <div className="section-header">
          <h2>TOP PROPERTY LISTINGS IN INDIA</h2>
          <p>
            <span className="highlight">Verified, Trusted</span> & Ready for You!
          </p>
        </div>
        
        {error ? (
          <div className="error-message">
            <p>Unable to load property counts. Please try again later.</p>
          </div>
        ) : (
          <div className="property-categories-carousel">
            <Swiper
              modules={[Autoplay, Navigation, Pagination]}
              spaceBetween={20}
              slidesPerView="auto"
              centeredSlides={false}
              loop={true}
              speed={800}
              autoplay={{
                delay: 1000,
                disableOnInteraction: false,
                pauseOnMouseEnter: false,
                reverseDirection: false,
              }}
              navigation={{
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
              }}
              pagination={{
                el: '.swiper-pagination',
                clickable: true,
                dynamicBullets: true,
              }}
              breakpoints={{
                320: {
                  slidesPerView: 2,
                  spaceBetween: 15,
                },
                480: {
                  slidesPerView: 3,
                  spaceBetween: 15,
                },
                768: {
                  slidesPerView: 4,
                  spaceBetween: 20,
                },
                1024: {
                  slidesPerView: 5,
                  spaceBetween: 20,
                },
                1200: {
                  slidesPerView: 6,
                  spaceBetween: 20,
                },
              }}
              className="property-categories-swiper"
            >
              {propertyCategories.map((category) => (
                <SwiperSlide key={category.id} className="category-slide">
                  <div 
                    className={`property-category-card ${activeCategory === category.id ? 'active' : ''}`}
                    onClick={() => handleCategoryClick(category)}
                  >
                    <div className="category-icon">
                      {category.icon}
                    </div>
                    <div className="category-text-content">
                      <h3 className="category-name">{category.name}</h3>
                      <p className="category-count">
                        ({loading ? '...' : propertyCounts[category.id] || 0})
                      </p>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
            
           
            
            {/* Pagination */}
            <div className="swiper-pagination"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyCategories;