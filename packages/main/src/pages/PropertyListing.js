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
        categoryId: searchParams.get('category') || '',
        city: searchParams.get('city') || '',
        minPrice: searchParams.get('minPrice') || '',
        maxPrice: searchParams.get('maxPrice') || '',
        bedrooms: searchParams.get('bedrooms') || '',
        furnishingStatus: searchParams.get('furnishing') || '',
        sortBy: searchParams.get('sortBy') || 'createdAt',
        sortOrder: searchParams.get('sortOrder') || 'DESC'
    });

    useEffect(() => {
        fetchProperties();
    }, [searchParams]);

    const fetchProperties = async () => {
        setLoading(true);
        try {
            const queryString = new URLSearchParams({
                ...filters,
                page: searchParams.get('page') || 1,
                limit: 12
            }).toString();
            
            const response = await fetch(`http://localhost:5000/api/properties?${queryString}`);
            const data = await response.json();
            
            if (data.success) {
                setProperties(data.data.properties);
                setPagination(data.data.pagination);
            }
        } catch (error) {
            console.error('Error fetching properties:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (name, value) => {
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

    return (
        <div className="property-listing-page">
            <div className="container">
                {/* Filters Sidebar */}
                <aside className="filters-sidebar">
                    <div className="filter-header">
                        <h3>Filters</h3>
                        <button 
                            className="clear-filters"
                            onClick={() => setSearchParams({})}
                        >
                            Clear All
                        </button>
                    </div>
                    
                    <div className="filter-group">
                        <label>City</label>
                        <input
                            type="text"
                            placeholder="Enter city"
                            value={filters.city}
                            onChange={(e) => handleFilterChange('city', e.target.value)}
                        />
                    </div>
                    
                    <div className="filter-group">
                        <label>Price Range</label>
                        <div className="price-inputs">
                            <input
                                type="number"
                                placeholder="Min"
                                value={filters.minPrice}
                                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                            />
                            <span>to</span>
                            <input
                                type="number"
                                placeholder="Max"
                                value={filters.maxPrice}
                                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                            />
                        </div>
                    </div>
                    
                    <div className="filter-group">
                        <label>Bedrooms</label>
                        <div className="bedroom-options">
                            {['1', '2', '3', '4', '5'].map(num => (
                                <button
                                    key={num}
                                    className={`bedroom-btn ${filters.bedrooms === num ? 'active' : ''}`}
                                    onClick={() => handleFilterChange('bedrooms', filters.bedrooms === num ? '' : num)}
                                >
                                    {num}{num === '5' ? '+' : ''}
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    <div className="filter-group">
                        <label>Furnishing</label>
                        <select 
                            value={filters.furnishingStatus}
                            onChange={(e) => handleFilterChange('furnishingStatus', e.target.value)}
                        >
                            <option value="">All</option>
                            <option value="furnished">Furnished</option>
                            <option value="semi-furnished">Semi-Furnished</option>
                            <option value="unfurnished">Unfurnished</option>
                        </select>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="properties-content">
                    {/* Results Header */}
                    <div className="results-header">
                        <h2>{pagination.total} Properties Found</h2>
                        <div className="sort-options">
                            <select 
                                value={`${filters.sortBy}-${filters.sortOrder}`}
                                onChange={(e) => {
                                    const [sortBy, sortOrder] = e.target.value.split('-');
                                    handleFilterChange('sortBy', sortBy);
                                    handleFilterChange('sortOrder', sortOrder);
                                }}
                            >
                                <option value="createdAt-DESC">Newest First</option>
                                <option value="price-ASC">Price: Low to High</option>
                                <option value="price-DESC">Price: High to Low</option>
                                <option value="superArea-DESC">Area: High to Low</option>
                            </select>
                        </div>
                    </div>

                    {/* Property Grid */}
                    {loading ? (
                        <div className="loading-container">
                            <div className="loader"></div>
                        </div>
                    ) : properties.length > 0 ? (
                        <>
                            <div className="properties-grid">
                                {properties.map(property => (
                                    <Link 
                                        to={`/property/${property.slug}`} 
                                        key={property.id}
                                        className="property-card"
                                    >
                                        <div className="property-image">
                                            <img 
                                                src={property.images?.[0]?.imageUrl || '/default-property.jpg'} 
                                                alt={property.title} 
                                            />
                                            <span className="property-badge">
                                                {property.category.name}
                                            </span>
                                        </div>
                                        
                                        <div className="property-info">
                                            <h3>{property.title}</h3>
                                            <p className="property-location">
                                                <i className="fas fa-map-marker-alt"></i>
                                                {property.locality}, {property.city}
                                            </p>
                                            
                                            <div className="property-details">
                                                <span><i className="fas fa-bed"></i> {property.bedrooms} BHK</span>
                                                <span><i className="fas fa-expand"></i> {property.superArea} sqft</span>
                                                <span><i className="fas fa-couch"></i> {property.furnishingStatus}</span>
                                            </div>
                                            
                                            <div className="property-footer">
                                                <div className="property-price">
                                                    {formatPrice(property.price)}
                                                </div>
                                                <span className="view-details">View Details →</span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
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
                            <img src="/no-properties.svg" alt="No properties" />
                            <h3>No properties found</h3>
                            <p>Try adjusting your filters</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default PropertyListing;