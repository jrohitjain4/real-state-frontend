// src/pages/PropertyDetail.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './PropertyDetail.css';

const PropertyDetail = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);
    const [showContactModal, setShowContactModal] = useState(false);

    useEffect(() => {
        fetchPropertyDetails();
    }, [slug]);

    const fetchPropertyDetails = async () => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:5000/api/properties/${slug}`);
            const data = await response.json();
            
            if (data.success) {
                setProperty(data.data);
            } else {
                navigate('/404');
            }
        } catch (error) {
            console.error('Error fetching property:', error);
            navigate('/404');
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

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loader"></div>
            </div>
        );
    }

    if (!property) {
        return null;
    }

    return (
        <div className="property-detail-page">
            {/* Image Gallery */}
            <div className="property-gallery">
                <div className="main-image">
                    <img 
                        src={property.images[selectedImage]?.imageUrl ? `http://localhost:5000${property.images[selectedImage].imageUrl}` : '/default-property.jpg'} 
                        alt={property.title} 
                    />
                </div>
                
                {property.images.length > 1 && (
                    <div className="image-thumbnails">
                        {property.images.map((image, index) => (
                            <div 
                                key={image.id}
                                className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                                onClick={() => setSelectedImage(index)}
                            >
                                <img src={`http://localhost:5000${image.imageUrl}`} alt={`View ${index + 1}`} />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="property-container">
                <div className="property-main">
                    {/* Property Header */}
                    <div className="property-header">
                        <div>
                            <h1>{property.title}</h1>
                            <p className="property-location">
                                <i className="fas fa-map-marker-alt"></i>
                                {property.address}, {property.locality}, {property.city}
                            </p>
                        </div>
                        
                        <div className="property-price">
                            {formatPrice(property.price)}
                            {property.negotiable && <span className="negotiable">Negotiable</span>}
                        </div>
                    </div>

                    {/* Key Details */}
                    <div className="key-details">
                        <div className="detail-item">
                            <i className="fas fa-home"></i>
                            <div>
                                <span>{property.config?.displayName || `${property.bedrooms} BHK`}</span>
                                <label>{property.subcategory.name}</label>
                            </div>
                        </div>
                        
                        <div className="detail-item">
                            <i className="fas fa-expand"></i>
                            <div>
                                <span>{property.superArea} sq.ft</span>
                                <label>Super Built-up Area</label>
                            </div>
                        </div>
                        
                        <div className="detail-item">
                            <i className="fas fa-calendar-check"></i>
                            <div>
                                <span>{property.possessionStatus === 'ready-to-move' ? 'Ready to Move' : 'Under Construction'}</span>
                                <label>Possession Status</label>
                            </div>
                        </div>
                        
                        <div className="detail-item">
                            <i className="fas fa-couch"></i>
                            <div>
                                <span>{property.furnishingStatus}</span>
                                <label>Furnishing</label>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="property-section">
                        <h2>Description</h2>
                        <p>{property.description}</p>
                    </div>

                    {/* Details */}
                    <div className="property-section">
                        <h2>Property Details</h2>
                        <div className="details-grid">
                            <div className="detail-row">
                                <span>Bedrooms</span>
                                <strong>{property.bedrooms}</strong>
                            </div>
                            <div className="detail-row">
                                <span>Bathrooms</span>
                                <strong>{property.bathrooms}</strong>
                            </div>
                            <div className="detail-row">
                                <span>Balconies</span>
                                <strong>{property.balconies}</strong>
                            </div>
                            <div className="detail-row">
                                <span>Floor</span>
                                <strong>{property.floorNumber} of {property.totalFloors}</strong>
                            </div>
                            <div className="detail-row">
                                <span>Carpet Area</span>
                                <strong>{property.carpetArea || 'N/A'} sq.ft</strong>
                            </div>
                            <div className="detail-row">
                                <span>Age of Property</span>
                                <strong>{property.ageOfProperty}</strong>
                            </div>
                            <div className="detail-row">
                                <span>Available From</span>
                                <strong>{new Date(property.availableFrom).toLocaleDateString()}</strong>
                            </div>
                            <div className="detail-row">
                                <span>Maintenance</span>
                                <strong>₹{property.maintenanceCharge}/month</strong>
                            </div>
                        </div>
                    </div>

                    {/* Amenities */}
                    {property.features && (
                        <div className="property-section">
                            <h2>Amenities</h2>
                            <div className="amenities-list">
                                {property.features.lift && <span><i className="fas fa-check"></i> Lift</span>}
                                {property.features.parking !== 'none' && <span><i className="fas fa-check"></i> Parking</span>}
                                {property.features.security && <span><i className="fas fa-check"></i> 24x7 Security</span>}
                                {property.features.powerBackup !== 'none' && <span><i className="fas fa-check"></i> Power Backup</span>}
                                {property.features.gym && <span><i className="fas fa-check"></i> Gym</span>}
                                {property.features.swimmingPool && <span><i className="fas fa-check"></i> Swimming Pool</span>}
                                {property.features.clubHouse && <span><i className="fas fa-check"></i> Club House</span>}
                                {property.features.playArea && <span><i className="fas fa-check"></i> Children's Play Area</span>}
                                {property.features.cctv && <span><i className="fas fa-check"></i> CCTV</span>}
                                {property.features.gasConnection && <span><i className="fas fa-check"></i> Gas Pipeline</span>}
                                {property.features.petFriendly && <span><i className="fas fa-check"></i> Pet Friendly</span>}
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <aside className="property-sidebar">
                    {/* Owner Card */}
                    <div className="owner-card">
                        <h3>Posted By</h3>
                        <div className="owner-info">
                            <img 
                                src={property.owner.profilePhoto || '/default-avatar.png'} 
                                alt={`${property.owner.firstName} ${property.owner.lastName}`} 
                            />
                            <div>
                                <h4>{`${property.owner.firstName} ${property.owner.lastName}`}</h4>
                                <p>{property.ownershipType === 'agent' ? 'Real Estate Agent' : 'Property Owner'}</p>
                                <p>Member since {new Date(property.owner.createdAt).getFullYear()}</p>
                            </div>
                        </div>
                        
                        <button 
                            className="contact-btn"
                            onClick={() => setShowContactModal(true)}
                        >
                            <i className="fas fa-phone"></i> View Contact
                        </button>
                    </div>

                    {/* Quick Actions */}
                    <div className="quick-actions">
                        <button className="action-btn">
                            <i className="fas fa-share-alt"></i> Share
                        </button>
                        <button className="action-btn">
                            <i className="fas fa-heart"></i> Save
                        </button>
                        <button className="action-btn">
                        <i className="fas fa-flag"></i> Report
                        </button>
                    </div>
                </aside>
            </div>

            {/* Contact Modal */}
            {showContactModal && (
                <div className="modal-overlay" onClick={() => setShowContactModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Contact Details</h3>
                            <button 
                                className="close-btn"
                                onClick={() => setShowContactModal(false)}
                            >
                                ×
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="contact-info">
                                <p><strong>Name:</strong> {property.owner.name}</p>
                                <p><strong>Phone:</strong> {property.owner.phone || 'Not provided'}</p>
                                <p><strong>Email:</strong> {property.owner.email}</p>
                            </div>
                            <div className="contact-note">
                                <i className="fas fa-info-circle"></i>
                                <p>Please mention you found this property on our website</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PropertyDetail;