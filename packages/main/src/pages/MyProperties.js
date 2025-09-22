// src/pages/MyProperties.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './MyProperties.css';

const MyProperties = () => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchMyProperties();
    }, [activeTab]);

    const fetchMyProperties = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (activeTab !== 'all') {
                params.append('status', activeTab);
            }
            const response = await fetch(`http://localhost:5000/api/my-properties?${params}`, {
                headers: {
                    'x-auth-token': token
                }
            });
            
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

    const handleDelete = async (propertyId) => {
        if (!window.confirm('Are you sure you want to delete this property?')) {
            return;
        }
        
        try {
            const response = await fetch(`http://localhost:5000/api/properties/${propertyId}`, {
                method: 'DELETE',
                headers: {
                    'x-auth-token': token
                }
            });
            
            const data = await response.json();
            if (data.success) {
                alert('Property deleted successfully');
                fetchMyProperties();
            } else {
                alert(data.message || 'Failed to delete property');
            }
        } catch (error) {
            console.error('Error deleting property:', error);
            alert('Failed to delete property');
        }
    };

    const getStatusBadge = (status) => {
        const statusClasses = {
            'pending': 'badge-warning',
            'active': 'badge-success',
            'inactive': 'badge-secondary',
            'sold': 'badge-info',
            'rented': 'badge-info'
        };
        
        return <span className={`status-badge ${statusClasses[status]}`}>{status}</span>;
    };

    return (
        <div className="my-properties-page">
            <div className="container">
                <div className="page-header">
                    <h1>My Properties</h1>
                    <Link to="/add-property" className="add-property-btn">
                        <i className="fas fa-plus"></i> Add New Property
                    </Link>
                </div>

                {/* Tabs */}
                <div className="property-tabs">
                    <button 
                        className={activeTab === 'all' ? 'active' : ''}
                        onClick={() => setActiveTab('all')}
                    >
                        All Properties
                    </button>
                    <button 
                        className={activeTab === 'active' ? 'active' : ''}
                        onClick={() => setActiveTab('active')}
                    >
                        Active
                    </button>
                    <button 
                        className={activeTab === 'pending' ? 'active' : ''}
                        onClick={() => setActiveTab('pending')}
                    >
                        Pending
                    </button>
                    <button 
                        className={activeTab === 'sold' ? 'active' : ''}
                        onClick={() => setActiveTab('sold')}
                    >
                        Sold/Rented
                    </button>
                </div>

                {/* Properties List */}
                {loading ? (
                    <div className="loading-container">
                        <div className="loader"></div>
                    </div>
                ) : properties.length > 0 ? (
                    <div className="properties-list">
                        {properties.map(property => (
                            <div key={property.id} className="property-item">
                                <div className="property-image">
                                    <img 
                                        src={property.images?.[0]?.imageUrl ? `http://localhost:5000${property.images[0].imageUrl}` : '/default-property.jpg'} 
                                        alt={property.title} 
                                    />
                                </div>
                                
                                <div className="property-details">
                                    <div className="property-header">
                                        <h3>{property.title}</h3>
                                        {getStatusBadge(property.status)}
                                    </div>
                                    
                                    <p className="property-location">
                                        <i className="fas fa-map-marker-alt"></i>
                                        {property.locality}, {property.city}
                                    </p>
                                    
                                    <div className="property-stats">
                                        <span><i className="fas fa-eye"></i> {property.viewCount} views</span>
                                        <span><i className="fas fa-calendar"></i> Posted on {new Date(property.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    
                                    <div className="property-price">
                                        ₹{property.price.toLocaleString('en-IN')}
                                    </div>
                                </div>
                                
                                <div className="property-actions">
                                    <Link 
                                        to={`/property/${property.slug}`} 
                                        className="action-btn view-btn"
                                        target="_blank"
                                    >
                                        <i className="fas fa-eye"></i> View
                                    </Link>
                                    <Link 
                                        to={`/edit-property/${property.id}`} 
                                        className="action-btn edit-btn"
                                    >
                                        <i className="fas fa-edit"></i> Edit
                                    </Link>
                                    <button 
                                        className="action-btn delete-btn"
                                        onClick={() => handleDelete(property.id)}
                                    >
                                        <i className="fas fa-trash"></i> Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="no-properties">
                        <img src="/no-properties.svg" alt="No properties" />
                        <h3>No properties found</h3>
                        <p>Start by adding your first property</p>
                        <Link to="/add-property" className="add-property-btn">
                            Add Property
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyProperties;