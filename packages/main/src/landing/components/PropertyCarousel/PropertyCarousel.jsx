// PropertyCarousel.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, A11y } from 'swiper/modules';
import { formatDistanceToNow } from 'date-fns';

import 'swiper/css';
import 'swiper/css/navigation';
import './PropertyCarousel.css';

const formatPrice = (price) => {
    if (!price || isNaN(price)) return '₹ Price on request';
    if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
    if (price >= 100000) return `₹${(price / 100000).toFixed(2)} Lac`;
    return `₹${price.toLocaleString('en-IN')}`;
};

const formatDate = (dateString) => {
    if (!dateString) return 'Recently';
    try {
        return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
        return 'Recently';
    }
};

const PropertyCarousel = () => {
    const [featuredProperties, setFeaturedProperties] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeaturedProperties = async () => {
            try {
                setLoading(true);
                // Fetch latest 5 properties sorted by creation date
                const response = await fetch('http://localhost:5000/api/properties?limit=5&sortBy=createdAt&sortOrder=DESC');
                const data = await response.json();
                
                if (data.success && data.data.properties) {
                    setFeaturedProperties(data.data.properties);
                } else {
                    setFeaturedProperties([]);
                }
            } catch (error) {
                console.error('Error fetching featured properties:', error);
                setFeaturedProperties([]);
            } finally {
                setLoading(false);
            }
        };

        fetchFeaturedProperties();
    }, []);

    // Don't render anything if no properties
    if (loading) {
        return (
            <section className="featured-properties-section">
                <div className="container">
                    <div className="carousel-header">
                        <div className="header-text">
                            <h2>Featured Properties for Sales</h2>
                            <p>Loading latest properties...</p>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    // Don't render if no properties available
    if (featuredProperties.length === 0) {
        return null;
    }

    return (
        <section className="featured-properties-section">
            <div className="container">
                
                <div className="carousel-header">
                    <div className="header-text">
                        <h2>Featured Properties for Sales</h2>
                        <p>Hand-picked selection of quality places</p>
                    </div>
                    <div className="swiper-navigation">
                        <div className="swiper-nav-button swiper-button-prev-custom">
                            <i className="fas fa-arrow-left"></i>
                        </div>
                        <div className="swiper-nav-button swiper-button-next-custom">
                            <i className="fas fa-arrow-right"></i>
                        </div>
                    </div>
                </div>

                <div className="swiper-container-wrapper">
                    <Swiper
                        modules={[Navigation, A11y]}
                        spaceBetween={30}
                        slidesPerView={1}
                        navigation={{
                            nextEl: '.swiper-button-next-custom',
                            prevEl: '.swiper-button-prev-custom',
                        }}
                        loop={true}
                        breakpoints={{
                            768: { slidesPerView: 2 },
                            1024: { slidesPerView: 3 },
                        }}
                        className="property-swiper"
                    >
                        {featuredProperties.map((property) => {
                            const primaryImage = property.images?.find(img => img.isPrimary) || property.images?.[0];
                            const imageUrl = primaryImage 
                                ? `http://localhost:5000${primaryImage.imageUrl}` 
                                : 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=870&q=80';
                            
                            const ownerAvatar = property.owner?.profilePicture 
                                ? `http://localhost:5000${property.owner.profilePicture}` 
                                : 'https://randomuser.me/api/portraits/lego/1.jpg';
                            
                            return (
                                <SwiperSlide key={property.id}>
                                    <div className="property-card">
                                        <div className="property-image-container">
                                            <img src={imageUrl} alt={property.title} className="property-image" />
                                            <div className="image-overlays">
                                                <div className="top-overlays">
                                                    <div className="tags-container">
                                                        {property.isFeatured && (
                                                            <span className="tag featured">
                                                                <i className="fas fa-star"></i>
                                                                Featured
                                                            </span>
                                                        )}
                                                        <span className="tag new">
                                                            <i className="fas fa-fire"></i>
                                                            New
                                                        </span>
                                                    </div>
                                                    <button className="wishlist-btn"><i className="far fa-heart"></i></button>
                                                </div>
                                                <div className="bottom-overlays">
                                                    <span className="property-price">{formatPrice(property.price)}</span>
                                                    <img src={ownerAvatar} alt="Owner" className="agent-avatar" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="property-details">
                                            <div className="reviews">
                                                <i className="fas fa-star"></i> 4.5
                                                <span>(0 Reviews)</span>
                                            </div>
                                            <h3 className="property-title">
                                                <Link to={`/property/${property.slug || property.id}`}>{property.title}</Link>
                                            </h3>
                                            <p className="property-location">
                                                <i className="fas fa-map-marker-alt"></i> {property.locality}, {property.city}
                                            </p>
                                            <div className="property-specs">
                                                {property.bedrooms > 0 && (
                                                    <span className="spec"><i className="fas fa-bed"></i> {property.bedrooms} Bedroom</span>
                                                )}
                                                {property.bathrooms > 0 && (
                                                    <span className="spec"><i className="fas fa-bath"></i> {property.bathrooms} Bath</span>
                                                )}
                                                {property.superArea && (
                                                    <span className="spec"><i className="fas fa-ruler-combined"></i> {property.superArea} Sq Ft</span>
                                                )}
                                            </div>
                                            <div className="property-footer">
                                                <span>Listed : {formatDate(property.createdAt)}</span>
                                                <span>Category : {property.category?.name || 'Property'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            );
                        })}
                    </Swiper>
                </div>
            </div>
        </section>
    );
};

export default PropertyCarousel;
