// src/pages/PropertyListing.js
import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import './PropertyListing.css';

const PropertyListing = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        total: 0,
        page: 1,
        totalPages: 0,
        limit: 12
    });
    
    const [filters, setFilters] = useState({
        categoryId: searchParams.get('categoryId') || searchParams.get('category') || '',
        subCategoryId: searchParams.get('subcategory') || '',
        property_for: searchParams.get('property_for') || '',
        city: searchParams.get('city') || '',
        minPrice: searchParams.get('minPrice') || '',
        maxPrice: searchParams.get('maxPrice') || '',
        bedrooms: searchParams.get('bedrooms') || '',
        furnishingStatus: searchParams.get('furnishing') || '',
        sortBy: searchParams.get('sortBy') || 'createdAt',
        sortOrder: searchParams.get('sortOrder') || 'DESC'
    });

    useEffect(() => {
        const newFilters = {
            categoryId: searchParams.get('categoryId') || searchParams.get('category') || '',
            subCategoryId: searchParams.get('subcategory') || '',
            property_for: searchParams.get('property_for') || '',
            city: searchParams.get('city') || '',
            minPrice: searchParams.get('minPrice') || '',
            maxPrice: searchParams.get('maxPrice') || '',
            bedrooms: searchParams.get('bedrooms') || '',
            furnishingStatus: searchParams.get('furnishing') || '',
            sortBy: searchParams.get('sortBy') || 'createdAt',
            sortOrder: searchParams.get('sortOrder') || 'DESC'
        };
        setFilters(newFilters);
        fetchProperties();
    }, [searchParams]);

    const fetchProperties = async () => {
        setLoading(true);
        try {
            const currentParams = new URLSearchParams(searchParams);
            if (!currentParams.has('page')) currentParams.set('page', '1');
            currentParams.set('limit', '12');

            const validParams = {};
            for (const [key, value] of currentParams.entries()) {
                if (value && value !== 'NaN' && value !== 'null' && value !== 'undefined') {
                    validParams[key] = value;
                }
            }
            
            const queryString = new URLSearchParams(validParams).toString();
            const response = await fetch(`http://localhost:5000/api/properties?${queryString}`);
            const data = await response.json();
            
            if (data.success) {
                setProperties(data.data.properties || data.data || []);
                setPagination(data.data.pagination || { total: 0, page: 1, totalPages: 0, limit: 12 });
            } else {
                setProperties([]);
                setPagination({ total: 0, page: 1, totalPages: 0, limit: 12 });
            }
        } catch (error) {
            console.error('Error fetching properties:', error);
            setProperties([]);
            setPagination({ total: 0, page: 1, totalPages: 0, limit: 12 });
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (name, value) => {
        const params = new URLSearchParams(searchParams);
        if (value) {
            params.set(name, value);
        } else {
            params.delete(name);
        }
        params.set('page', '1');
        setSearchParams(params);
    };

    const handlePageChange = (page) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', page);
        setSearchParams(params);
    };

    const formatPrice = (price) => {
        if (!price || isNaN(price)) return 'Price on request';
        if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
        if (price >= 100000) return `₹${(price / 100000).toFixed(2)} Lac`;
        return `₹${price.toLocaleString('en-IN')}`;
    };

    const formatDatePosted = (dateString) => {
        if (!dateString) return null;
        try {
            return formatDistanceToNow(new Date(dateString), { addSuffix: true });
        } catch (error) {
            return null;
        }
    };

    return (
        <div className="property-listing-page" style={{ paddingTop: '70px' }}>
            {/* Top Filters Bar */}
            <div className="top-filters-bar">
                <div className="container">
                    <div className="filters-row">
                        <div className="filter-item">
                            <select value={filters.categoryId} onChange={(e) => handleFilterChange('categoryId', e.target.value)} className="filter-select">
                                <option value="">Buy/Rent</option>
                                <option value="1">Buy</option>
                                <option value="2">Rent</option>
                                <option value="3">PG</option>
                            </select>
                        </div>
                        <div className="filter-item">
                            <input type="text" placeholder="Enter city" value={filters.city} onChange={(e) => handleFilterChange('city', e.target.value)} className="filter-input" />
                        </div>
                        <div className="filter-item">
                            <select value={filters.bedrooms} onChange={(e) => handleFilterChange('bedrooms', e.target.value)} className="filter-select">
                                <option value="">BHK</option>
                                <option value="1">1 BHK</option>
                                <option value="2">2 BHK</option>
                                <option value="3">3 BHK</option>
                                <option value="4">4+ BHK</option>
                            </select>
                        </div>
                        <div className="filter-item price-filter">
                            <input type="number" placeholder="Min Price" value={filters.minPrice} onChange={(e) => handleFilterChange('minPrice', e.target.value)} className="price-input" />
                            <span>to</span>
                            <input type="number" placeholder="Max Price" value={filters.maxPrice} onChange={(e) => handleFilterChange('maxPrice', e.target.value)} className="price-input" />
                        </div>
                        <div className="filter-item">
                            <select value={filters.property_for} onChange={(e) => handleFilterChange('property_for', e.target.value)} className="filter-select">
                                <option value="">Property Type</option>
                                <option value="residential">Residential</option>
                                <option value="commercial">Commercial</option>
                            </select>
                        </div>
                        <button className="clear-filters-btn" onClick={() => setSearchParams({})}>Clear All</button>
                    </div>
                </div>
            </div>

            <div className="container">
                <div className="main-content-wrapper">
                    <div className="properties-main-content">
                        {/* Results Header */}
                        <div className="results-section">
                            <div className="results-header">
                                <h2 style={{ marginTop: '20px', color: '#4d2f6a', marginBottom: '20px' }}>
                                    {pagination.total} Properties Found {filters.city && `in ${filters.city.charAt(0).toUpperCase() + filters.city.slice(1)}`}
                                </h2>
                                <div className="sort-options">
                                    <select value={`${filters.sortBy}-${filters.sortOrder}`} onChange={(e) => { const [sortBy, sortOrder] = e.target.value.split('-'); handleFilterChange('sortBy', sortBy); handleFilterChange('sortOrder', sortOrder); }} className="sort-select">
                                        <option value="createdAt-DESC">Newest First</option>
                                        <option value="price-ASC">Price: Low to High</option>
                                        <option value="price-DESC">Price: High to Low</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Property Content */}
                        {loading ? (
                            <div className="loading-container"><div className="loader"></div></div>
                        ) : properties.length > 0 ? (
                        <>
                            <div className="content-with-sidebar">
                                <div className="properties-list">
                                    {properties.map(property => (
                                    <div key={property.id} className="property-card-mb">
                                        <div className="card-left-column">
                                            <div className="card-image-section">
                                                <img src={property.images && property.images.length > 0 ? `http://localhost:5000${property.images[0].imageUrl}` : '/img/placeholder.jpg'} alt={property.title}/>
                                                <div className="view-images-overlay">View More Images</div>
                                            </div>
                                            <div className="card-owner-section">
                                                <div className="owner-name">
                                                    {property.ownershipType === 'agent' ? 'Agent' : 'Owner'} : <strong>{property.owner ? `${property.owner.firstName} ${property.owner.lastName}` : 'N/A'}</strong>
                                                </div>
                                                <div className="premium-badge-mb"><i className="fas fa-star"></i> Premium Member</div>
                                                <div className="posted-time">{formatDatePosted(property.createdAt)}</div>
                                            </div>
                                        </div>
                                        <div className="card-details-section">
                                            <div className="card-details-header">
                                                <h4 className="card-title"><Link to={`/property/${property.slug}`}>{property.title} for {property.category?.name || 'Sale'} in {property.city}</Link></h4>
                                                <div className="card-actions-icons"><i className="far fa-heart"></i><i className="fas fa-share-alt"></i></div>
                                            </div>
                                            <div className="card-specs">
                                                <div className="spec-item-mb"><i className="fas fa-vector-square spec-icon"></i><div className="spec-text"><span className="spec-label">Carpet Area</span><span className="spec-value">{property.carpetArea || 'N/A'} sqft</span></div></div>
                                                <div className="spec-item-mb"><i className="fas fa-calendar-check spec-icon"></i><div className="spec-text"><span className="spec-label">Availability</span><span className="spec-value">{property.possessionStatus === 'ready-to-move' ? 'Ready To Move' : 'Under Construction'}</span></div></div>
                                                <div className="spec-item-mb"><i className="fas fa-building spec-icon"></i><div className="spec-text"><span className="spec-label">Floors</span><span className="spec-value">{property.floorNumber || '?'} out of {property.totalFloors || '?'}</span></div></div>
                                            </div>
                                            <p className="card-description">{property.description && (property.description.length > 150 ? `${property.description.substring(0, 150)}...` : property.description)}</p>
                                            <Link to={`/property/${property.slug}`} className="read-more-link">Read More</Link>
                                        </div>
                                        <div className="card-price-actions-section">
                                            <div className="card-price-details">
                                                <div className="main-price">{formatPrice(property.price)}</div>
                                                <div className="price-per-sqft">₹{property.price && (property.superArea || property.plotArea) ? Math.round(property.price / (property.superArea || property.plotArea)).toLocaleString() : 'N/A'} per sqft</div>
                                            </div>
                                            <div className="card-buttons">
                                                <button className="contact-owner-btn">Contact Owner</button>
                                                <button className="get-phone-btn-mb">Get Phone No.</button>
                                            </div>
                                        </div>
                                    </div>
                                    ))}
                                </div>
                                <aside className="right-sidebar">
                                    <div className="dream-house-banner"><div className="dream-house-content"><h2 className="dream-title">Dream House</h2><h3 className="dream-subtitle">of Yours</h3><p className="dream-description">Find your perfect home with our extensive collection of premium properties. Your dream home is just a click away!</p><button className="dream-cta">Explore Now</button></div><div className="dream-house-image"><img src="/img/about.jpg" alt="Dream House" /></div></div>
                                    <div className="banner-card alert-banner"><div className="alert-content"><i className="fas fa-bell"></i><h4>Get Property Alerts</h4><p>Never miss a property that matches your requirements</p><button className="alert-cta">Set Alert</button></div></div>
                                    <div className="stats-banner"><h4>Our Success</h4><div className="stats-grid"><div className="stat-item"><span className="stat-number">500+</span><span className="stat-label">Properties</span></div><div className="stat-item"><span className="stat-number">200+</span><span className="stat-label">Happy Clients</span></div><div className="stat-item"><span className="stat-number">50+</span><span className="stat-label">Cities</span></div><div className="stat-item"><span className="stat-number">5★</span><span className="stat-label">Rating</span></div></div></div>
                                    
                                    {/* New Banner 1 - Investment Guide */}
                                    <div className="banner-card investment-banner">
                                        <div className="investment-content">
                                            <i className="fas fa-chart-line"></i>
                                            <h4>Investment Guide</h4>
                                            <p>Learn the best property investment strategies and market insights</p>
                                            <button className="investment-cta">Read Guide</button>
                                        </div>
                                    </div>

                                    {/* New Banner 2 - Home Loan */}
                                    <div className="banner-card loan-banner">
                                        <div className="loan-content">
                                            <i className="fas fa-home"></i>
                                            <h4>Home Loan</h4>
                                            <p>Get instant home loan approval with competitive interest rates</p>
                                            <button className="loan-cta">Apply Now</button>
                                        </div>
                                    </div>

                                    {/* New Banner 3 - Property Valuation */}
                                    <div className="banner-card valuation-banner">
                                        <div className="valuation-content">
                                            <i className="fas fa-calculator"></i>
                                            <h4>Property Valuation</h4>
                                            <p>Get accurate property valuation and market price estimates</p>
                                            <button className="valuation-cta">Get Valuation</button>
                                        </div>
                                    </div>

                                    {/* New Banner 4 - Expert Consultation */}
                                    <div className="banner-card expert-banner">
                                        <div className="expert-content">
                                            <i className="fas fa-user-tie"></i>
                                            <h4>Expert Consultation</h4>
                                            <p>Talk to our property experts for personalized advice</p>
                                            <button className="expert-cta">Book Now</button>
                                        </div>
                                    </div>

                                    {/* Luxury Villa Banner */}
                                    <div className="banner-card luxury-villa-banner">
                                        <div className="luxury-villa-content">
                                            <div className="luxury-image">
                                                <img src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&h=200&fit=crop" alt="Luxury Villa" />
                                                <div className="luxury-overlay">
                                                    <h4>Luxury Villas</h4>
                                                    <p>Premium villas with modern amenities</p>
                                                    <button className="luxury-cta">Explore Villas</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Penthouse Banner */}
                                    <div className="banner-card penthouse-banner">
                                        <div className="penthouse-content">
                                            <div className="penthouse-image">
                                                <img src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=200&fit=crop" alt="Penthouse" />
                                                <div className="penthouse-overlay">
                                                    <h4>Penthouses</h4>
                                                    <p>Exclusive penthouses with city views</p>
                                                    <button className="penthouse-cta">View Penthouses</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Luxury Apartments Banner */}
                                    <div className="banner-card luxury-apartment-banner">
                                        <div className="luxury-apartment-content">
                                            <div className="luxury-apartment-image">
                                                <img src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=200&fit=crop" alt="Luxury Apartment" />
                                                <div className="luxury-apartment-overlay">
                                                    <h4>Luxury Apartments</h4>
                                                    <p>High-end apartments with premium features</p>
                                                    <button className="luxury-apartment-cta">Browse Apartments</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Farmhouse Banner */}
                                    <div className="banner-card farmhouse-banner">
                                        <div className="farmhouse-content">
                                            <div className="farmhouse-image">
                                                <img src="https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=400&h=200&fit=crop" alt="Farmhouse" />
                                                <div className="farmhouse-overlay">
                                                    <h4>Farmhouses</h4>
                                                    <p>Spacious farmhouses with natural surroundings</p>
                                                    <button className="farmhouse-cta">Discover Farmhouses</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Commercial Properties Banner */}
                                    <div className="banner-card commercial-banner">
                                        <div className="commercial-content">
                                            <i className="fas fa-building"></i>
                                            <h4>Commercial Properties</h4>
                                            <p>Office spaces, shops, and commercial real estate</p>
                                            <button className="commercial-cta">View Commercial</button>
                                        </div>
                                    </div>

                                    {/* Property Management Banner */}
                                    <div className="banner-card management-banner">
                                        <div className="management-content">
                                            <i className="fas fa-cogs"></i>
                                            <h4>Property Management</h4>
                                            <p>Professional property management services</p>
                                            <button className="management-cta">Learn More</button>
                                        </div>
                                    </div>

                                    {/* Real Estate News Banner */}
                                    <div className="banner-card news-banner">
                                        <div className="news-content">
                                            <i className="fas fa-newspaper"></i>
                                            <h4>Market News</h4>
                                            <p>Latest real estate trends and market updates</p>
                                            <button className="news-cta">Read News</button>
                                        </div>
                                    </div>

                                    {/* Contact Us Banner */}
                                    <div className="banner-card contact-banner">
                                        <div className="contact-content">
                                            <i className="fas fa-phone"></i>
                                            <h4>Contact Us</h4>
                                            <p>Get in touch with our expert team</p>
                                            <button className="contact-cta">Call Now</button>
                                        </div>
                                    </div>
                                </aside>
                            </div>

                            {/* Pagination */}
                            {pagination.totalPages > 1 && (
                                <div className="pagination">
                                    <button onClick={() => handlePageChange(pagination.page - 1)} disabled={pagination.page === 1}>Previous</button>
                                    {[...Array(pagination.totalPages)].map((_, i) => (<button key={i + 1} onClick={() => handlePageChange(i + 1)} className={pagination.page === i + 1 ? 'active' : ''}>{i + 1}</button>))}
                                    <button onClick={() => handlePageChange(pagination.page + 1)} disabled={pagination.page === pagination.totalPages}>Next</button>
                                </div>
                            )}
                        </>
                        ) : (
                            <div className="no-properties">
                                <div className="no-properties-content">
                                    <i className="fas fa-home" style={{fontSize: '64px', color: '#ccc', marginBottom: '20px'}}></i>
                                    <h3>No properties found</h3>
                                    <p>{filters.city ? `No properties available in "${filters.city}". Try searching in other cities.` : 'Try adjusting your search filters to find more properties.'}</p>
                                    <button className="reset-filters-btn" onClick={() => setSearchParams({})}>Clear All Filters</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PropertyListing;