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
                if (value) validParams[key] = value;
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
                                {/* THE CHANGE IS HERE: The inline style was removed from this div */}
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
                                                <h4 className="card-title"><Link to={`/property/${property.slug}`}>{property.bedrooms > 0 ? `${property.bedrooms} BHK ` : ''}{property.subcategory?.name || 'Property'} for Sale in {property.locality}, {property.city}</Link></h4>
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