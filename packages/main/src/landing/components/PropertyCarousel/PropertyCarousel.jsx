import React from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, A11y } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import './PropertyCarousel.css';

const featuredProperties = [
    {
        id: 1, slug: 'luxurious-sea-view-apartment', title: 'Luxurious Sea View Apartment', price: 35000000, category: { name: 'Apartment' },
        images: [{ imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=870&q=80' }],
        locality: 'Bandra West', city: 'Mumbai', bedrooms: 3, bathrooms: 3, superArea: 1800,
    },
    {
        id: 2, slug: 'modern-independent-villa', title: 'Modern Independent Villa', price: 52500000, category: { name: 'Villa' },
        images: [{ imageUrl: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?ixlib=rb-4.0.3&auto=format&fit=crop&w=870&q=80' }],
        locality: 'Jubilee Hills', city: 'Hyderabad', bedrooms: 4, bathrooms: 5, superArea: 3200,
    },
    {
        id: 3, slug: 'cozy-2bhk-flat-in-city-center', title: 'Cozy 2BHK Flat in City Center', price: 8500000, category: { name: 'Flat' },
        images: [{ imageUrl: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&auto=format&fit=crop&w=870&q=80' }],
        locality: 'Indiranagar', city: 'Bangalore', bedrooms: 2, bathrooms: 2, superArea: 1250,
    },
    {
        id: 4, slug: 'spacious-penthouse-with-terrace', title: 'Spacious Penthouse with Terrace', price: 78000000, category: { name: 'Penthouse' },
        images: [{ imageUrl: 'https://images.unsplash.com/photo-1594411998064-897e085a6331?ixlib=rb-4.0.3&auto=format&fit=crop&w=774&q=80' }],
        locality: 'DLF Phase 5', city: 'Gurgaon', bedrooms: 5, bathrooms: 6, superArea: 4500,
    },
    {
        id: 5, slug: 'ready-to-move-in-studio-apartment', title: 'Ready to Move-in Studio', price: 5500000, category: { name: 'Studio' },
        images: [{ imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=870&q=80' }],
        locality: 'Hinjewadi', city: 'Pune', bedrooms: 1, bathrooms: 1, superArea: 650,
    },
    {
        id: 6, slug: 'farmhouse-with-private-pool', title: 'Farmhouse with Private Pool', price: 95000000, category: { name: 'Farmhouse' },
        images: [{ imageUrl: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&auto=format&fit=crop&w=774&q=80' }],
        locality: 'Ecr Road', city: 'Chennai', bedrooms: 4, bathrooms: 4, superArea: 5500,
    },
];

const PropertyCarousel = () => {
    
    const formatPrice = (price) => {
        if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
        if (price >= 100000) return `₹${(price / 100000).toFixed(2)} Lac`;
        return `₹${price.toLocaleString('en-IN')}`;
    };
    
    return (
        <section className="property-carousel-section">
            <div className="container">
                <div className="carousel-header">
                    <h2>Featured Properties</h2>
                    <p>Handpicked properties from our exclusive portfolio</p>
                </div>
                
                {/* --- WRAPPER FOR SWIPER AND NAVIGATION --- */}
                <div className="carousel-wrapper">
                    <Swiper
                        modules={[Navigation, Pagination, A11y]}
                        spaceBetween={30}
                        slidesPerView={1}
                        navigation={{
                            nextEl: '.swiper-button-next-custom',
                            prevEl: '.swiper-button-prev-custom',
                        }}
                        pagination={{ clickable: true }}
                        loop={true}
                        breakpoints={{
                            640: { slidesPerView: 2, spaceBetween: 20 },
                            1024: { slidesPerView: 3, spaceBetween: 30 },
                        }}
                        className="property-swiper"
                    >
                        {featuredProperties.map((property) => (
                            <SwiperSlide key={property.id}>
                                {/* --- VERTICAL CARD STRUCTURE --- */}
                                <div className="property-card-vertical">
                                    <div className="property-image-wrapper">
                                        <img src={property.images[0]?.imageUrl} alt={property.title} className="property-image" />
                                        <div className="property-badge">{property.category?.name}</div>
                                    </div>
                                    <div className="property-content">
                                        <div className="property-info-main">
                                            <h3 className="property-title">{property.title}</h3>
                                            <div className="property-location">
                                                <i className="fas fa-map-marker-alt"></i>
                                                {property.locality}, {property.city}
                                            </div>
                                            <div className="property-features">
                                                <span className="feature"><i className="fas fa-ruler-combined"></i> {property.superArea} sqft</span>
                                                <span className="feature"><i className="fas fa-bed"></i> {property.bedrooms} Bed</span>
                                                <span className="feature"><i className="fas fa-bath"></i> {property.bathrooms} Bath</span>
                                            </div>
                                        </div>
                                        <div className="property-footer">
                                            <div className="property-price">{formatPrice(property.price)}</div>
                                            <Link to={`/property/${property.slug}`} className="view-property-btn">Details</Link>
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                    
                    {/* --- CUSTOM NAVIGATION BUTTONS --- */}
                    <div className="swiper-button-prev-custom">
                        <i className="fas fa-chevron-left"></i>
                    </div>
                    <div className="swiper-button-next-custom">
                        <i className="fas fa-chevron-right"></i>
                    </div>
                </div>

                <div className="carousel-footer">
                    <Link to="/properties" className="view-all-btn">
                        View All Properties
                        <i className="fas fa-arrow-right"></i>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default PropertyCarousel;