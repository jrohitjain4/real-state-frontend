// PropertyCarousel.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, A11y } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import './PropertyCarousel.css';

// --- NEW, RELIABLE IMAGE URLS THAT WILL NOT BREAK ---
const featuredProperties = [
    {
        id: 1,
        slug: 'grand-villa-house',
        title: 'Grand Villa House',
        // Reliable Unsplash URL
        imageUrl: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=870&q=80',
        price: 1370,
        tags: [{ text: 'Featured', type: 'featured' }],
        rating: 4.9,
        reviews: 25,
        location: '10, Oak Ridge Villa, USA',
        bedrooms: 4,
        bathrooms: 3,
        area: 520,
        listedDate: '28 Apr 2025',
        category: 'Villa',
        agent: {
            // Using a reliable placeholder for agent avatar
            avatarUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
        }
    },
    {
        id: 2,
        slug: 'elite-suite-room',
        title: 'Elite Suite Room',
        // Reliable Unsplash URL
        imageUrl: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=870&q=80',
        price: 2470,
        tags: [],
        rating: 4.4,
        reviews: 79,
        location: '42, Maple Grove Residences, USA',
        bedrooms: 2,
        bathrooms: 1,
        area: 480,
        listedDate: '14 Apr 2025',
        category: 'Suite',
        agent: {
            avatarUrl: 'https://randomuser.me/api/portraits/women/17.jpg',
        }
    },
    {
        id: 3,
        slug: 'serenity-condo-suite',
        title: 'Serenity Condo Suite',
        // Reliable Unsplash URL
        imageUrl: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=870&q=80',
        price: 21000,
        tags: [{ text: 'New', type: 'new' }, { text: 'Featured', type: 'featured' }],
        rating: 5.0,
        reviews: 20,
        location: '17, Grove Towers, New York, USA',
        bedrooms: 4,
        bathrooms: 4,
        area: 350,
        listedDate: '16 Jan 2023',
        category: 'Apartment',
        agent: {
            avatarUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
        }
    },
    {
        id: 4,
        slug: 'modern-downtown-loft',
        title: 'Modern Downtown Loft',
        // Reliable Unsplash URL
        imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=870&q=80',
        price: 3200,
        tags: [{ text: 'Hot', type: 'new' }],
        rating: 4.7,
        reviews: 45,
        location: '112, Urban Center, LA, USA',
        bedrooms: 1,
        bathrooms: 1,
        area: 400,
        listedDate: '05 May 2024',
        category: 'Loft',
        agent: {
            avatarUrl: 'https://randomuser.me/api/portraits/men/46.jpg',
        }
    },
];

const formatPrice = (price) => `$${price.toLocaleString('en-US')}`;

const PropertyCarousel = () => {
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
                        {featuredProperties.map((property) => (
                            <SwiperSlide key={property.id}>
                                <div className="property-card">
                                    <div className="property-image-container">
                                        <img src={property.imageUrl} alt={property.title} className="property-image" />
                                        <div className="image-overlays">
                                            <div className="top-overlays">
                                                <div className="tags-container">
                                                    {property.tags.map((tag, index) => (
                                                        <span key={index} className={`tag ${tag.type}`}>
                                                            {tag.type === 'featured' && <i className="fas fa-star"></i>}
                                                            {tag.type === 'new' && <i className="fas fa-fire"></i>}
                                                            {tag.text}
                                                        </span>
                                                    ))}
                                                </div>
                                                <button className="wishlist-btn"><i className="far fa-heart"></i></button>
                                            </div>
                                            <div className="bottom-overlays">
                                                <span className="property-price">{formatPrice(property.price)}</span>
                                                <img src={property.agent.avatarUrl} alt="Agent" className="agent-avatar" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="property-details">
                                        <div className="reviews">
                                            <i className="fas fa-star"></i> {property.rating.toFixed(1)}
                                            <span>({property.reviews} Reviews)</span>
                                        </div>
                                        <h3 className="property-title">
                                            <Link to={`/property/${property.slug}`}>{property.title}</Link>
                                        </h3>
                                        <p className="property-location">
                                            <i className="fas fa-map-marker-alt"></i> {property.location}
                                        </p>
                                        <div className="property-specs">
                                            <span className="spec"><i className="fas fa-bed"></i> {property.bedrooms} Bedroom</span>
                                            <span className="spec"><i className="fas fa-bath"></i> {property.bathrooms} Bath</span>
                                            <span className="spec"><i className="fas fa-ruler-combined"></i> {property.area} Sq Ft</span>
                                        </div>
                                        <div className="property-footer">
                                            <span>Listed on : {property.listedDate}</span>
                                            <span>Category : {property.category}</span>
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </section>
    );
};

export default PropertyCarousel;
