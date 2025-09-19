// src/pages/PropertyListing.js
import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
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
        city: searchParams.get('city') || '',
        minPrice: searchParams.get('minPrice') || '',
        maxPrice: searchParams.get('maxPrice') || '',
        bedrooms: searchParams.get('bedrooms') || '',
        furnishingStatus: searchParams.get('furnishing') || '',
        sortBy: searchParams.get('sortBy') || 'createdAt',
        sortOrder: searchParams.get('sortOrder') || 'DESC'
    });

    useEffect(() => {
        // Update filters when URL params change
        const newFilters = {
            categoryId: searchParams.get('categoryId') || searchParams.get('category') || '',
            city: searchParams.get('city') || '',
            minPrice: searchParams.get('minPrice') || '',
            maxPrice: searchParams.get('maxPrice') || '',
            bedrooms: searchParams.get('bedrooms') || '',
            furnishingStatus: searchParams.get('furnishing') || '',
            sortBy: searchParams.get('sortBy') || 'createdAt',
            sortOrder: searchParams.get('sortOrder') || 'DESC'
        };
        
        console.log('📄 URL params changed, updating filters:', newFilters);
        setFilters(newFilters);
        
        fetchProperties();
    }, [searchParams]);

    const fetchProperties = async () => {
        setLoading(true);
        try {
            // Use current URL params directly for API call
            const currentFilters = {
                categoryId: searchParams.get('categoryId') || searchParams.get('category') || '',
                city: searchParams.get('city') || '',
                minPrice: searchParams.get('minPrice') || '',
                maxPrice: searchParams.get('maxPrice') || '',
                bedrooms: searchParams.get('bedrooms') || '',
                furnishingStatus: searchParams.get('furnishing') || '',
                page: searchParams.get('page') || 1,
                limit: 12
            };
            
            // Remove empty filters
            Object.keys(currentFilters).forEach(key => {
                if (!currentFilters[key]) {
                    delete currentFilters[key];
                }
            });
            
            const queryString = new URLSearchParams(currentFilters).toString();
            
            console.log('🔍 Fetching properties with filters:', currentFilters);
            console.log('🌐 API URL:', `http://localhost:5000/api/properties?${queryString}`);
            
            const response = await fetch(`http://localhost:5000/api/properties?${queryString}`);
            const data = await response.json();
            
            if (data.success) {
                console.log(`✅ Found ${data.data.properties.length} properties`);
                setProperties(data.data.properties);
                setPagination(data.data.pagination);
            } else {
                console.log('❌ API returned error:', data.message);
            }
        } catch (error) {
            console.error('Error fetching properties:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (name, value) => {
        console.log(`🎛️ Filter changed: ${name} = "${value}"`);
        
        const newFilters = { ...filters, [name]: value };
        setFilters(newFilters);
        
        // Update URL params
        const params = new URLSearchParams(searchParams);
        if (value) {
            params.set(name, value);
        } else {
            params.delete(name);
        }
        params.set('page', '1'); // Reset to first page
        setSearchParams(params);
        
        console.log('🔄 Updated URL params:', params.toString());
    };

    const handlePageChange = (page) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', page);
        setSearchParams(params);
    };

    const formatPrice = (price) => {
        if (price >= 10000000) {
            return `₹${(price / 10000000).toFixed(2)} Cr`;
        } else if (price >= 100000) {
            return `₹${(price / 100000).toFixed(2)} Lac`;
        }
        return `₹${price.toLocaleString('en-IN')}`;
    };

    const getPropertyDisplayTitle = (property) => {
        // If title is generic like "1bhk", create a better title
        const title = property.title.toLowerCase();
        if (title === '1bhk' || title === '2bhk' || title === '3bhk' || title.length < 5) {
            const category = property.category?.name || 'Sale';
            const location = property.locality || property.city;
            return `For ${category} in ${location}`;
        }
        return property.title;
    };

    return (
        <div className="property-listing-page" style={{ paddingTop: '70px' }}>
            {/* Top Filters Bar - MagicBricks Style */}
            <div className="top-filters-bar">
                <div className="container">
                    <div className="filters-row">
                        <div className="filter-item">
                            <select 
                                value={filters.categoryId}
                                onChange={(e) => handleFilterChange('categoryId', e.target.value)}
                                className="filter-select"
                            >
                                <option value="">Buy/Rent</option>
                                <option value="1">Buy</option>
                                <option value="2">Rent</option>
                                <option value="3">PG</option>
                            </select>
                        </div>
                        
                        <div className="filter-item">
                            <input
                                type="text"
                                placeholder="Enter city (e.g., indore, lalitpiur)"
                                value={filters.city}
                                onChange={(e) => handleFilterChange('city', e.target.value)}
                                className="filter-input"
                                list="city-suggestions"
                            />
                            <datalist id="city-suggestions">
                                <option value="indore">Indore</option>
                                <option value="lalitpiur">Lalitpiur</option>
                                <option value="Test City">Test City</option>
                                <option value="mumbai">Mumbai</option>
                                <option value="delhi">Delhi</option>
                                <option value="bangalore">Bangalore</option>
                            </datalist>
                        </div>
                        
                        <div className="filter-item">
                            <select 
                                value={filters.bedrooms}
                                onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
                                className="filter-select"
                            >
                                <option value="">BHK</option>
                                <option value="1">1 BHK</option>
                                <option value="2">2 BHK</option>
                                <option value="3">3 BHK</option>
                                <option value="4">4+ BHK</option>
                            </select>
                        </div>
                        
                        <div className="filter-item">
                            <select 
                                value={filters.furnishingStatus}
                                onChange={(e) => handleFilterChange('furnishingStatus', e.target.value)}
                                className="filter-select"
                            >
                                <option value="">Furnishing</option>
                                <option value="furnished">Furnished</option>
                                <option value="semi-furnished">Semi-Furnished</option>
                                <option value="unfurnished">Unfurnished</option>
                            </select>
                        </div>
                        
                        <div className="filter-item price-filter">
                            <input
                                type="number"
                                placeholder="Min Price"
                                value={filters.minPrice}
                                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                                className="price-input"
                            />
                            <span>to</span>
                            <input
                                type="number"
                                placeholder="Max Price"
                                value={filters.maxPrice}
                                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                                className="price-input"
                            />
                        </div>
                        
                        <button className="clear-filters-btn" onClick={() => setSearchParams({})}>
                            Clear All
                        </button>
                    </div>
                </div>
            </div>

            <div className="container">
                <div className="main-content-wrapper">
                    {/* Left Content - Properties */}
                    <div className="properties-main-content">
                        {/* Results Header */}
                        <div className="results-section">
                            <div className="results-header">
                                <h2 style={{ marginTop: '20px' , color: '#4d2f6a' , marginBottom: '20px' }}>
                                    {pagination.total} Properties Found
                                    {filters.city && ` in ${filters.city.charAt(0).toUpperCase() + filters.city.slice(1)}`}
                                </h2>
                                <div className="sort-options" style={{ marginRight: '20px' }} >
                                    <select 
                                        value={`${filters.sortBy}-${filters.sortOrder}`}
                                        onChange={(e) => {
                                            const [sortBy, sortOrder] = e.target.value.split('-');
                                            handleFilterChange('sortBy', sortBy);
                                            handleFilterChange('sortOrder', sortOrder);
                                        }}
                                        className="sort-select"
                                    >
                                        <option value="createdAt-DESC">Newest First</option>
                                        <option value="price-ASC">Price: Low to High</option>
                                        <option value="price-DESC">Price: High to Low</option>
                                        <option value="superArea-DESC">Area: High to Low</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Property Content */}
                        {loading ? (
                            <div className="loading-container">
                                <div className="loader"></div>
                            </div>
                        ) : properties.length > 0 ? (
                        <>
                            <div className="content-with-sidebar">
                                <div className="properties-list">
                                    {properties.map(property => (
                                    <div 
                                        key={property.id}
                                        className="property-card-horizontal"
                                    >
                                        {/* Property Image */}
                                        <div className="property-image-section">
                                            <div className="property-image-container">
                                                <img 
                                                    src={
                                                        property.images && property.images.length > 0 
                                                            ? property.images[0].imageUrl
                                                            : '/img/portfolio/01-small.jpg'
                                                    }
                                                    alt={property.title}
                                                    className="property-main-image"
                                                />
                                                <div className="image-count-badge">
                                                    <i className="fas fa-camera"></i>
                                                    {property.images?.length || 0}+ Photos
                                                </div>
                                                <div className="property-status-badge">
                                                    Updated today
                                                </div>
                                            </div>
                                        </div>

                                        {/* Property Details */}
                                        <div className="property-details-section">
                                            {/* Main Title */}
                                            <h3 className="property-main-title">
                                                <Link to={`/property/${property.slug}`}>
                                                    {property.bedrooms > 0 ? `${property.bedrooms} BHK ` : ''}
                                                    {property.subcategory?.name || 'Property'} for {property.category?.name} in {property.city}
                                                </Link>
                                            </h3>

                                            {/* Property Info Boxes */}
                                            <div className="property-info-boxes">
                                                <div className="info-box">
                                                    <i className="fas fa-expand-arrows-alt"></i>
                                                    <div className="info-content">
                                                        <span className="info-label">
                                                            {property.plotArea ? 'PLOT AREA' : property.carpetArea ? 'CARPET AREA' : 'SUPER AREA'}
                                                        </span>
                                                        <span className="info-value">
                                                            {property.carpetArea || property.superArea || property.plotArea} sqft
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="info-box">
                                                    <i className="fas fa-home"></i>
                                                    <div className="info-content">
                                                        <span className="info-label">STATUS</span>
                                                        <span className="info-value">
                                                            {property.possessionStatus === 'ready-to-move' ? 'Ready to Move' : 
                                                             property.possessionStatus === 'under-construction' ? 'Under Construction' :
                                                             'Ready to Move'}
                                                        </span>
                                                    </div>
                                                </div>

                                                {property.floorNumber && (
                                                    <div className="info-box">
                                                        <i className="fas fa-building"></i>
                                                        <div className="info-content">
                                                            <span className="info-label">FLOOR</span>
                                                            <span className="info-value">
                                                                {property.floorNumber} out of {property.totalFloors || 'N/A'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Property Description */}
                                            <p className="property-description">
                                                {property.description.length > 80 
                                                    ? `${property.description.substring(0, 80)}...`
                                                    : property.description
                                                }
                                            </p>

                                            {/* Owner Info */}
                                            <div className="owner-info">
                                                <span className="owner-label">
                                                    <i className="fas fa-user"></i>
                                                    Owner: {property.owner?.name || 'Private Owner'}
                                                </span>
                                                <span className="premium-badge">
                                                    <i className="fas fa-star"></i>
                                                    Premium Member
                                                </span>
                                            </div>
                                        </div>

                                        {/* Price and Actions */}
                                        <div className="property-actions-section">
                                            <div className="price-section">
                                                <div className="property-price">
                                                    {formatPrice(property.price)}
                                                </div>
                                                <div className="price-per-sqft">
                                                    ₹{Math.round(property.price / (property.superArea || property.plotArea || 1)).toLocaleString()} per sqft
                                                </div>
                                            </div>

                                            <div className="action-buttons">
                                                <button className="contact-agent-btn">
                                                    Contact Owner
                                                </button>
                                                <button className="get-phone-btn">
                                                    <i className="fas fa-phone"></i>
                                                    Get Phone No.
                                                </button>
                                            </div>

                                            <div className="property-meta">
                                                <Link 
                                                    to={`/property/${property.slug}`}
                                                    className="view-details-link"
                                                >
                                                    View Details →
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                    ))}
                                </div>

                                {/* Right Sidebar - Dream House Banner */}
                                <aside className="right-sidebar">
                                    {/* Dream House Banner */}
                                    <div className="dream-house-banner">
                                        <div className="dream-house-content">
                                            <h2 className="dream-title">Dream House</h2>
                                            <h3 className="dream-subtitle">of Yours</h3>
                                            <p className="dream-description">
                                                Find your perfect home with our extensive collection of premium properties. 
                                                Your dream home is just a click away!
                                            </p>
                                            <button className="dream-cta">
                                                Explore Now
                                            </button>
                                        </div>
                                        <div className="dream-house-image">
                                            <img src="/img/about.jpg" alt="Dream House" />
                                        </div>
                                    </div>

                                    {/* Property Alerts Banner */}
                                    <div className="banner-card alert-banner">
                                        <div className="alert-content">
                                            <i className="fas fa-bell"></i>
                                            <h4>Get Property Alerts</h4>
                                            <p>Never miss a property that matches your requirements</p>
                                            <button className="alert-cta">
                                                Set Alert
                                            </button>
                                        </div>
                                    </div>

                                    {/* Quick Stats */}
                                    <div className="stats-banner">
                                        <h4>Our Success</h4>
                                        <div className="stats-grid">
                                            <div className="stat-item">
                                                <span className="stat-number">500+</span>
                                                <span className="stat-label">Properties</span>
                                            </div>
                                            <div className="stat-item">
                                                <span className="stat-number">200+</span>
                                                <span className="stat-label">Happy Clients</span>
                                            </div>
                                            <div className="stat-item">
                                                <span className="stat-number">50+</span>
                                                <span className="stat-label">Cities</span>
                                            </div>
                                            <div className="stat-item">
                                                <span className="stat-number">5★</span>
                                                <span className="stat-label">Rating</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Home Loan Banner */}
                                    <div className="banner-card loan-banner">
                                        <div className="loan-content">
                                            <div className="loan-icon">
                                                <i className="fas fa-home"></i>
                                            </div>
                                            <h4>Home Loan</h4>
                                            <p>Get instant approval on home loans with lowest interest rates</p>
                                            <div className="loan-features">
                                                <span>✓ Instant Approval</span>
                                                <span>✓ Lowest Rates</span>
                                                <span>✓ Quick Process</span>
                                            </div>
                                            <button className="loan-cta">Apply Now</button>
                                        </div>
                                        <div className="loan-image">
                                            <img src="/img/portfolio/03-small.jpg" alt="Home Loan" />
                                        </div>
                                    </div>

                                    {/* Premium Services Banner */}
                                    <div className="banner-card premium-banner">
                                        <div className="premium-content">
                                            <div className="premium-badge">
                                                <i className="fas fa-crown"></i>
                                                PREMIUM
                                            </div>
                                            <h4>VIP Property Services</h4>
                                            <p>Get exclusive access to premium properties and personalized assistance</p>
                                            <ul className="premium-features">
                                                <li><i className="fas fa-check"></i> Priority Viewing</li>
                                                <li><i className="fas fa-check"></i> Dedicated Agent</li>
                                                <li><i className="fas fa-check"></i> Exclusive Deals</li>
                                            </ul>
                                            <button className="premium-cta">Upgrade to Premium</button>
                                        </div>
                                        <div className="premium-image">
                                            <img src="/img/portfolio/04-small.jpg" alt="Premium Services" />
                                        </div>
                                    </div>

                                    {/* Investment Guide Banner */}
                                    <div className="banner-card investment-banner">
                                        <div className="investment-image-bg">
                                            <img src="/img/portfolio/05-small.jpg" alt="Investment Guide" />
                                        </div>
                                        <div className="investment-overlay">
                                            <div className="investment-content">
                                                <i className="fas fa-chart-line"></i>
                                                <h4>Property Investment Guide</h4>
                                                <p>Learn how to make smart property investments and maximize your returns</p>
                                                <button className="investment-cta">
                                                    <i className="fas fa-download"></i>
                                                    Download Guide
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Customer Reviews Banner */}
                                    <div className="banner-card reviews-banner">
                                        <h4>What Our Customers Say</h4>
                                        <div className="review-item">
                                            <div className="review-avatar">
                                                <img src="/img/team/01.jpg" alt="Customer" />
                                            </div>
                                            <div className="review-content">
                                                <div className="review-stars">
                                                    ★★★★★
                                                </div>
                                                <p>"Amazing service! Found my dream home within a week."</p>
                                                <span className="reviewer-name">- Rajesh Kumar</span>
                                            </div>
                                        </div>
                                        <div className="review-item">
                                            <div className="review-avatar">
                                                <img src="/img/team/02.jpg" alt="Customer" />
                                            </div>
                                            <div className="review-content">
                                                <div className="review-stars">
                                                    ★★★★★
                                                </div>
                                                <p>"Professional team and excellent support throughout."</p>
                                                <span className="reviewer-name">- Priya Sharma</span>
                                            </div>
                                        </div>
                                    </div>
                                </aside>
                            </div>

                            {/* Pagination */}
                            {pagination.totalPages > 1 && (
                                <div className="pagination">
                                    <button 
                                        onClick={() => handlePageChange(pagination.page - 1)}
                                        disabled={pagination.page === 1}
                                    >
                                        Previous
                                    </button>
                                    
                                    {[...Array(pagination.totalPages)].map((_, i) => (
                                        <button
                                            key={i + 1}
                                            onClick={() => handlePageChange(i + 1)}
                                            className={pagination.page === i + 1 ? 'active' : ''}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                    
                                    <button 
                                        onClick={() => handlePageChange(pagination.page + 1)}
                                        disabled={pagination.page === pagination.totalPages}
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </>
                        ) : (
                            <div className="no-properties">
                                <div className="no-properties-content">
                                    <i className="fas fa-home" style={{fontSize: '64px', color: '#ccc', marginBottom: '20px'}}></i>
                                    <h3>No properties found</h3>
                                    <p>
                                        {filters.city 
                                            ? `No properties available in "${filters.city}". Try searching in other cities.`
                                            : 'Try adjusting your search filters to find more properties.'
                                        }
                                    </p>
                                    <button 
                                        className="reset-filters-btn"
                                        onClick={() => {
                                            setSearchParams({});
                                            setFilters({
                                                categoryId: '',
                                                city: '',
                                                minPrice: '',
                                                maxPrice: '',
                                                bedrooms: '',
                                                furnishingStatus: '',
                                                sortBy: 'createdAt',
                                                sortOrder: 'DESC'
                                            });
                                        }}
                                    >
                                        Clear All Filters
                                    </button>
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