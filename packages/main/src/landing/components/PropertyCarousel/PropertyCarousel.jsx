import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './PropertyCarousel.css';

const PropertyCarousel = () => {
    const [properties, setProperties] = useState([]);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFeaturedProperties();
    }, []);

    const fetchFeaturedProperties = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/properties?limit=6&sortBy=price&sortOrder=DESC');
            const data = await response.json();
            
            if (data.success) {
                setProperties(data.data.properties);
            }
        } catch (error) {
            console.error('Error fetching properties:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatPrice = (price) => {
        if (price >= 10000000) {
            return `₹${(price / 10000000).toFixed(2)} Cr`;
        } else if (price >= 100000) {
            return `₹${(price / 100000).toFixed(2)} Lac`;
        }
        return `₹${price.toLocaleString('en-IN')}`;
    };

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % Math.ceil(properties.length / 3));
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + Math.ceil(properties.length / 3)) % Math.ceil(properties.length / 3));
    };

    const getVisibleProperties = () => {
        const startIndex = currentSlide * 3;
        return properties.slice(startIndex, startIndex + 3);
    };

    if (loading) {
        return (
            <div className="property-carousel-loading">
                <div className="loader"></div>
            </div>
        );
    }

    if (properties.length === 0) {
        return null;
    }

    return (
        <section className="property-carousel-section">
            <div className="container">
                <div className="carousel-header">
                    <h2>Premium Properties</h2>
                    <p>Discover our finest collection of luxury properties</p>
                </div>

                <div className="property-carousel">
                    <button className="carousel-btn prev-btn" onClick={prevSlide}>
                        <i className="fas fa-chevron-left"></i>
                    </button>

                    <div className="carousel-container">
                        <div 
                            className="carousel-track"
                            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                        >
                            {Array.from({ length: Math.ceil(properties.length / 3) }).map((_, slideIndex) => (
                                <div key={slideIndex} className="carousel-slide">
                                    {properties.slice(slideIndex * 3, slideIndex * 3 + 3).map((property) => (
                                        <div key={property.id} className="property-card-carousel">
                                            <div className="property-image-wrapper">
                                                <img 
                                                    src={
                                                        property.images && property.images.length > 0 
                                                            ? property.images[0].imageUrl
                                                            : '/img/portfolio/01-small.jpg'
                                                    }
                                                    alt={property.title}
                                                    className="property-image"
                                                />
                                                <div className="property-overlay">
                                                    <div className="property-badge">
                                                        {property.category?.name}
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="property-content">
                                                <div className="property-location">
                                                    <i className="fas fa-map-marker-alt"></i>
                                                    {property.locality}, {property.city}
                                                </div>
                                                
                                                <h3 className="property-title">
                                                    {property.bedrooms > 0 ? `${property.bedrooms} BHK ` : ''}
                                                    {property.subcategory?.name}
                                                </h3>
                                                
                                                <div className="property-features">
                                                    {property.superArea && (
                                                        <span className="feature">
                                                            <i className="fas fa-expand-arrows-alt"></i>
                                                            {property.superArea} sqft
                                                        </span>
                                                    )}
                                                    {property.bedrooms > 0 && (
                                                        <span className="feature">
                                                            <i className="fas fa-bed"></i>
                                                            {property.bedrooms} Bed
                                                        </span>
                                                    )}
                                                    {property.bathrooms > 0 && (
                                                        <span className="feature">
                                                            <i className="fas fa-bath"></i>
                                                            {property.bathrooms} Bath
                                                        </span>
                                                    )}
                                                </div>
                                                
                                                <div className="property-footer">
                                                    <div className="property-price">
                                                        {formatPrice(property.price)}
                                                    </div>
                                                    <Link 
                                                        to={`/property/${property.slug}`}
                                                        className="view-property-btn"
                                                    >
                                                        View Details
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>

                    <button className="carousel-btn next-btn" onClick={nextSlide}>
                        <i className="fas fa-chevron-right"></i>
                    </button>
                </div>

                <div className="carousel-indicators">
                    {Array.from({ length: Math.ceil(properties.length / 3) }).map((_, index) => (
                        <button
                            key={index}
                            className={`indicator ${currentSlide === index ? 'active' : ''}`}
                            onClick={() => setCurrentSlide(index)}
                        ></button>
                    ))}
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
