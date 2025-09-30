// // src/pages/PropertyDetail.js - Redesigned with Backend Integration
// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate, Link } from 'react-router-dom';
// import './PropertyDetail.css';

// const PropertyDetail = () => {
//     const { slug } = useParams();
//     const navigate = useNavigate();
//     const [property, setProperty] = useState(null);
//     const [similarProperties, setSimilarProperties] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [showContactModal, setShowContactModal] = useState(false);
//     const [selectedImage, setSelectedImage] = useState(0);

//     useEffect(() => {
//         fetchPropertyDetails();
//     }, [slug]);

//     useEffect(() => {
//         if (property) {
//             fetchSimilarProperties();
//         }
//     }, [property]);

//     const fetchPropertyDetails = async () => {
//         setLoading(true);
//         try {
//             const response = await fetch(`http://localhost:5000/api/properties/${slug}`);
//             const data = await response.json();
            
//             if (data.success) {
//                 console.log('🔍 Property data received:', data.data);
//                 console.log('🔍 Owner data:', data.data.owner);
//                 console.log('🔍 Features data:', data.data.features);
//                 setProperty(data.data);
//             } else {
//                 navigate('/404');
//             }
//         } catch (error) {
//             console.error('Error fetching property:', error);
//             navigate('/404');
//         } finally {
//             setLoading(false);
//         }
//     };

//     const fetchSimilarProperties = async () => {
//         try {
//             if (!property) return;
            
//             // First try to get properties of same type from same city
//             let response = await fetch(`http://localhost:5000/api/properties?limit=10&city=${encodeURIComponent(property.city)}&subCategoryId=${property.subCategoryId}`);
//             let data = await response.json();
            
//             let similar = [];
            
//             if (data.success && data.data.properties && data.data.properties.length > 0) {
//                 // Filter out current property and get same type from same city
//                 similar = data.data.properties
//                     .filter(p => p.slug !== slug)
//                     .slice(0, 6);
//             }
            
//             // If not enough properties of same type, get other properties from same city
//             if (similar.length < 6) {
//                 response = await fetch(`http://localhost:5000/api/properties?limit=10&city=${encodeURIComponent(property.city)}`);
//                 data = await response.json();
                
//                 if (data.success && data.data.properties) {
//                     const cityProperties = data.data.properties
//                         .filter(p => p.slug !== slug && !similar.find(s => s.id === p.id))
//                         .slice(0, 6 - similar.length);
                    
//                     similar = [...similar, ...cityProperties];
//                 }
//             }
            
//             // If still not enough, get properties from same category
//             if (similar.length < 6) {
//                 response = await fetch(`http://localhost:5000/api/properties?limit=10&categoryId=${property.categoryId}`);
//                 data = await response.json();
                
//                 if (data.success && data.data.properties) {
//                     const categoryProperties = data.data.properties
//                         .filter(p => p.slug !== slug && !similar.find(s => s.id === p.id))
//                         .slice(0, 6 - similar.length);
                    
//                     similar = [...similar, ...categoryProperties];
//                 }
//             }
            
//             setSimilarProperties(similar);
//         } catch (error) {
//             console.error('Error fetching similar properties:', error);
//         }
//     };

//     const formatPrice = (price) => {
//         if (price >= 1000000) {
//             return `$${Math.round(price / 1000)},000`;
//         }
//         return `$${price.toLocaleString()}`;
//     };

//     if (loading) {
//         return (
//             <div className="loading-container">
//                 <div className="loader"></div>
//             </div>
//         );
//     }

//     if (!property) {
//         return null;
//     }

//     return (
//         <div className="property-detail-page">
//             {/* Full Width Image Gallery */}
//             <div className="full-width-gallery">
//                 <div className="main-image-container">
//                     <img 
//                         src={property.images && property.images[selectedImage]?.imageUrl ? 
//                             `http://localhost:5000${property.images[selectedImage].imageUrl}` : 
//                             '/default-property.jpg'} 
//                         alt={property.title}
//                         className="main-image"
//                     />
                    
//                     {/* Image Navigation */}
//                     {property.images && property.images.length > 1 && (
//                         <>
//                             <button 
//                                 className="image-nav prev"
//                                 onClick={() => setSelectedImage(prev => prev > 0 ? prev - 1 : property.images.length - 1)}
//                             >
//                                 <i className="fas fa-chevron-left"></i>
//                             </button>
//                             <button 
//                                 className="image-nav next"
//                                 onClick={() => setSelectedImage(prev => prev < property.images.length - 1 ? prev + 1 : 0)}
//                             >
//                                 <i className="fas fa-chevron-right"></i>
//                             </button>
                            
//                             {/* Image Counter */}
//                             <div className="image-counter">
//                                 {selectedImage + 1} / {property.images.length}
//                             </div>
//                         </>
//                     )}
//                 </div>
                
//                 {/* Image Thumbnails */}
//                 {property.images && property.images.length > 1 && (
//                     <div className="image-thumbnails">
//                         <div className="imu">
//                         {property.images.map((image, index) => (
//                             <img
//                                 key={index}
//                                 src={`http://localhost:5000${image.imageUrl}`}
//                                 alt={`Thumbnail ${index + 1}`}
//                                 className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                                            
//                                 onClick={() => setSelectedImage(index)}
//                                 />
//                             ))}
//                         </div>
//                     </div>
//                 )}
//             </div>

//             {/* Main Content Container */}
//             <div className="main-content-container">
//                 <div className="content-wrapper">
//                     {/* Left Side - Property Details */}
//                     <div className="left-content">
//                         {/* Property Header */}
//                         <div className="property-header">
//                             <h1 className="property-title">{property.title}</h1>
//                             <div className="property-location">
//                                 <i className="fas fa-map-marker-alt"></i>
//                                 {property.address}, {property.locality}, {property.city}, {property.state}
//                             </div>
//                             <div className="property-price">
//                                 {formatPrice(property.price)}
//                                 {property.negotiable && <span className="negotiable">Negotiable</span>}
//                             </div>
//                         </div>

//                         {/* Key Details */}
//                         <div className="key-details">
//                             <h3>Key Details</h3>
//                             <div className="details-grid">
//                                 {property.bedrooms && (
//                                     <div className="detail-item">
//                                         <i className="fas fa-bed"></i>
//                                         <span className="detail-label">Bedrooms</span>
//                                         <span className="detail-value">{property.bedrooms}</span>
//                                     </div>
//                                 )}
//                                 {property.bathrooms && (
//                                     <div className="detail-item">
//                                         <i className="fas fa-bath"></i>
//                                         <span className="detail-label">Bathrooms</span>
//                                         <span className="detail-value">{property.bathrooms}</span>
//                                     </div>
//                                 )}
//                                 {property.superArea && (
//                                     <div className="detail-item">
//                                         <i className="fas fa-expand"></i>
//                                         <span className="detail-label">Super Area</span>
//                                         <span className="detail-value">{property.superArea} sqft</span>
//                                     </div>
//                                 )}
//                                 {property.carpetArea && (
//                                     <div className="detail-item">
//                                         <i className="fas fa-vector-square"></i>
//                                         <span className="detail-label">Carpet Area</span>
//                                         <span className="detail-value">{property.carpetArea} sqft</span>
//                                     </div>
//                                 )}
//                                 {property.floorNumber && (
//                                     <div className="detail-item">
//                                         <i className="fas fa-building"></i>
//                                         <span className="detail-label">Floor</span>
//                                         <span className="detail-value">{property.floorNumber}{property.totalFloors ? ` of ${property.totalFloors}` : ''}</span>
//                                     </div>
//                                 )}
//                                 {property.ageOfProperty && (
//                                     <div className="detail-item">
//                                         <i className="fas fa-calendar"></i>
//                                         <span className="detail-label">Age</span>
//                                         <span className="detail-value">{property.ageOfProperty}</span>
//                                     </div>
//                                 )}
//                             </div>
//                         </div>

//                         {/* Property Details */}
//                         <div className="property-details-section">
//                             <h3>Property Details</h3>
//                             <div className="details-list">
//                                 <div className="detail-row">
//                                     <span className="detail-label">Property Type</span>
//                                     <span className="detail-value">{property.subcategory?.name || 'Property'}</span>
//                                 </div>
//                                 <div className="detail-row">
//                                     <span className="detail-label">Category</span>
//                                     <span className="detail-value">{property.category?.name || 'N/A'}</span>
//                                 </div>
//                                 {property.furnishingStatus && (
//                                     <div className="detail-row">
//                                         <span className="detail-label">Furnishing</span>
//                                         <span className="detail-value">{property.furnishingStatus}</span>
//                                     </div>
//                                 )}
//                                 {property.possessionStatus && (
//                                     <div className="detail-row">
//                                         <span className="detail-label">Possession</span>
//                                         <span className="detail-value">{property.possessionStatus === 'ready-to-move' ? 'Ready to Move' : 'Under Construction'}</span>
//                                     </div>
//                                 )}
//                                 {property.availableFrom && (
//                                     <div className="detail-row">
//                                         <span className="detail-label">Available From</span>
//                                         <span className="detail-value">{new Date(property.availableFrom).toLocaleDateString()}</span>
//                                     </div>
//                                 )}
//                                 {property.maintenanceCharge && (
//                                     <div className="detail-row">
//                                         <span className="detail-label">Maintenance</span>
//                                         <span className="detail-value">₹{property.maintenanceCharge}/month</span>
//                                     </div>
//                                 )}
//                             </div>
//                         </div>

//                         {/* Description Section */}
//                         <div className="description-section">
//                             <h3>Description</h3>
//                             <p className="property-description">
//                                 {property.description || 'Located in a prime location with excellent connectivity and modern amenities, this property offers the perfect blend of comfort and convenience. The well-designed layout ensures optimal space utilization while maintaining aesthetic appeal.'}
//                             </p>
//                             <p className="property-description-extra">
//                                 An ideal choice for families and professionals who will be able to take advantage of its modern facilities, excellent location, and comprehensive amenities.
//                             </p>
//                             <button className="view-more-btn">View More</button>
//                         </div>

//                         {/* Overview Section */}
//                         <div className="overview-section">
//                             <h3>Overview</h3>
//                             <div className="overview-grid">
//                                 <div className="overview-item">
//                                     <div className="overview-icon">
//                                         <i className="fas fa-home"></i>
//                                     </div>
//                                     <div className="overview-details">
//                                         <span className="overview-label">ID:</span>
//                                         <span className="overview-value">{property.id?.slice(-4) || 'N/A'}</span>
//                                     </div>
//                                 </div>
//                                 <div className="overview-item">
//                                     <div className="overview-icon">
//                                         <i className="fas fa-building"></i>
//                                     </div>
//                                     <div className="overview-details">
//                                         <span className="overview-label">Type:</span>
//                                         <span className="overview-value">{property.subcategory?.name || 'Property'}</span>
//                                     </div>
//                                 </div>
//                                 <div className="overview-item">
//                                     <div className="overview-icon">
//                                         <i className="fas fa-car"></i>
//                                     </div>
//                                     <div className="overview-details">
//                                         <span className="overview-label">Garages:</span>
//                                         <span className="overview-value">{property.features?.parking === 'car' || property.features?.parking === 'both' ? '1' : '0'}</span>
//                                     </div>
//                                 </div>
//                                 <div className="overview-item">
//                                     <div className="overview-icon">
//                                         <i className="fas fa-bed"></i>
//                                     </div>
//                                     <div className="overview-details">
//                                         <span className="overview-label">Bedrooms:</span>
//                                         <span className="overview-value">{property.bedrooms ? `${property.bedrooms} Rooms` : 'N/A'}</span>
//                                     </div>
//                                 </div>
//                                 <div className="overview-item">
//                                     <div className="overview-icon">
//                                         <i className="fas fa-bath"></i>
//                                     </div>
//                                     <div className="overview-details">
//                                         <span className="overview-label">Bathrooms:</span>
//                                         <span className="overview-value">{property.bathrooms ? `${property.bathrooms} Rooms` : 'N/A'}</span>
//                                     </div>
//                                 </div>
//                                 <div className="overview-item">
//                                     <div className="overview-icon">
//                                         <i className="fas fa-expand-arrows-alt"></i>
//                                     </div>
//                                     <div className="overview-details">
//                                         <span className="overview-label">Land Size:</span>
//                                         <span className="overview-value">{property.superArea ? `${property.superArea.toLocaleString()} SqFt` : 'N/A'}</span>
//                                     </div>
//                                 </div>
//                                 <div className="overview-item">
//                                     <div className="overview-icon">
//                                         <i className="fas fa-hammer"></i>
//                                     </div>
//                                     <div className="overview-details">
//                                         <span className="overview-label">Year Built:</span>
//                                         <span className="overview-value">{property.ageOfProperty === 'new' ? '2024' : property.ageOfProperty || 'N/A'}</span>
//                                     </div>
//                                 </div>
//                                 <div className="overview-item">
//                                     <div className="overview-icon">
//                                         <i className="fas fa-ruler"></i>
//                                     </div>
//                                     <div className="overview-details">
//                                         <span className="overview-label">Size:</span>
//                                         <span className="overview-value">{property.carpetArea ? `${property.carpetArea.toLocaleString()} SqFt` : 'N/A'}</span>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Right Side - Contact & Amenities */}
//                     <div className="right-content">
//                         {/* Contact Card */}
//                         <div className="contact-card">
//                             <h3>Contact Owner</h3>
//                             <div className="owner-info">
//                                 <div className="owner-avatar">
//                                     {property.owner.firstName?.charAt(0)}{property.owner.lastName?.charAt(0)}
//                                 </div>
//                                 <div className="owner-details">
//                                     <h4>{`${property.owner.firstName} ${property.owner.lastName}`}</h4>
//                                     <p className="owner-type">
//                                         {property.ownershipType === 'agent' ? 'Real Estate Agent' : 
//                                          property.ownershipType === 'dealer' ? 'Property Dealer' :
//                                          property.ownershipType === 'builder' ? 'Builder/Developer' :
//                                          'Property Owner'}
//                                     </p>
//                                     <p className="member-since">
//                                         Member since {new Date(property.owner.createdAt).getFullYear()}
//                                     </p>
//                                 </div>
//                             </div>
                            
//                             <div className="contact-actions">
//                                 <button 
//                                     className="contact-btn primary"
//                                     onClick={() => setShowContactModal(true)}
//                                 >
//                                     <i className="fas fa-phone"></i> Contact Now
//                                 </button>
//                                 <button className="contact-btn secondary">
//                                     <i className="fas fa-envelope"></i> Email
//                                 </button>
//                             </div>
                            
//                             {(property.owner.phone || property.owner.mobile || property.owner.contactNumber) && (
//                                 <div className="phone-display">
//                                     <i className="fas fa-phone"></i>
//                                     <a href={`tel:${property.owner.phone || property.owner.mobile || property.owner.contactNumber}`}>
//                                         {property.owner.phone || property.owner.mobile || property.owner.contactNumber}
//                                     </a>
//                                 </div>
//                             )}
//                         </div>

//                         {/* Amenities Card */}
//                         <div className="amenities-card">
//                             <h3>Amenities & Features</h3>
//                             {property.features && Object.keys(property.features).some(key => property.features[key] === true || (property.features[key] && property.features[key] !== 'none')) ? (
//                                 <div className="amenities-list">
//                                     {property.features.lift && <div className="amenity-item"><i className="fas fa-elevator"></i> Lift</div>}
//                                     {property.features.parking && property.features.parking !== 'none' && (
//                                         <div className="amenity-item"><i className="fas fa-car"></i> Parking ({property.features.parking})</div>
//                                     )}
//                                     {property.features.security && <div className="amenity-item"><i className="fas fa-shield-alt"></i> 24x7 Security</div>}
//                                     {property.features.powerBackup && property.features.powerBackup !== 'none' && (
//                                         <div className="amenity-item"><i className="fas fa-bolt"></i> Power Backup ({property.features.powerBackup})</div>
//                                     )}
//                                     {property.features.waterSupply && property.features.waterSupply !== 'none' && (
//                                         <div className="amenity-item"><i className="fas fa-tint"></i> Water Supply ({property.features.waterSupply})</div>
//                                     )}
//                                     {property.features.cctv && <div className="amenity-item"><i className="fas fa-video"></i> CCTV</div>}
//                                     {property.features.gasConnection && <div className="amenity-item"><i className="fas fa-fire"></i> Gas Pipeline</div>}
//                                     {property.features.petFriendly && <div className="amenity-item"><i className="fas fa-paw"></i> Pet Friendly</div>}
//                                     {property.features.vastu && <div className="amenity-item"><i className="fas fa-compass"></i> Vastu Compliant</div>}
//                                     {property.features.intercom && <div className="amenity-item"><i className="fas fa-phone"></i> Intercom</div>}
//                                     {property.features.visitorParking && <div className="amenity-item"><i className="fas fa-car"></i> Visitor Parking</div>}
//                                     {property.features.gym && <div className="amenity-item"><i className="fas fa-dumbbell"></i> Gym</div>}
//                                     {property.features.swimmingPool && <div className="amenity-item"><i className="fas fa-swimming-pool"></i> Swimming Pool</div>}
//                                     {property.features.clubHouse && <div className="amenity-item"><i className="fas fa-home"></i> Club House</div>}
//                                     {property.features.playArea && <div className="amenity-item"><i className="fas fa-child"></i> Children's Play Area</div>}
//                                     {property.features.garden && <div className="amenity-item"><i className="fas fa-seedling"></i> Garden</div>}
//                                 </div>
//                             ) : (
//                                 <div className="no-amenities">
//                                     <i className="fas fa-info-circle"></i>
//                                     <p>No amenities information available for this property.</p>
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Similar Properties */}
//             {similarProperties.length > 0 && (
//                 <div className="similar-properties">
//                     <div className="container">
//                         <h2>Similar Properties</h2>
//                         <div className="similar-properties-wrapper">
//                             <div className="similar-properties-scroll" id="similarPropertiesScroll">
//                                 {similarProperties.map(prop => (
//                                     <Link key={prop.id} to={`/property/${prop.slug}`} className="similar-property-card">
//                                         <div className="property-image">
//                                             <img 
//                                                 src={prop.images && prop.images[0]?.imageUrl ? 
//                                                     `http://localhost:5000${prop.images[0].imageUrl}` : 
//                                                     '/default-property.jpg'} 
//                                                 alt={prop.title}
//                                             />
//                                         </div>
//                                         <div className="property-info">
//                                             <h4>{prop.title}</h4>
//                                             <p className="property-location">
//                                                 <i className="fas fa-map-marker-alt"></i>
//                                                 {prop.locality}, {prop.city}
//                                             </p>
//                                             <div className="property-specs">
//                                                 {prop.bedrooms && <span>{prop.bedrooms} BHK</span>}
//                                                 {prop.superArea && <span>{prop.superArea} sqft</span>}
//                                             </div>
//                                             <div className="property-price">{formatPrice(prop.price)}</div>
//                                         </div>
//                                     </Link>
//                                 ))}
//                             </div>
                            
//                             {/* Carousel Navigation */}
//                             <button 
//                                 className="carousel-nav prev"
//                                 onClick={() => {
//                                     const scrollContainer = document.getElementById('similarPropertiesScroll');
//                                     if (scrollContainer) {
//                                         scrollContainer.scrollBy({ left: -300, behavior: 'smooth' });
//                                     }
//                                 }}
//                             >
//                                 <i className="fas fa-chevron-left"></i>
//                             </button>
//                             <button 
//                                 className="carousel-nav next"
//                                 onClick={() => {
//                                     const scrollContainer = document.getElementById('similarPropertiesScroll');
//                                     if (scrollContainer) {
//                                         scrollContainer.scrollBy({ left: 300, behavior: 'smooth' });
//                                     }
//                                 }}
//                             >
//                                 <i className="fas fa-chevron-right"></i>
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* Contact Modal */}
//             {showContactModal && (
//                 <div className="modal-overlay" onClick={() => setShowContactModal(false)}>
//                     <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//                         <div className="modal-header">
//                             <h3>Contact Information</h3>
//                             <button 
//                                 className="close-btn"
//                                 onClick={() => setShowContactModal(false)}
//                             >
//                                 ×
//                             </button>
//                         </div>
//                         <div className="modal-body">
//                             <div className="contact-info">
//                                 <p>
//                                     <strong>Name:</strong> 
//                                     {`${property.owner.firstName} ${property.owner.lastName}`}
//                                 </p>
//                                 <p>
//                                     <strong>Type:</strong> 
//                                     {property.ownershipType === 'agent' ? 'Real Estate Agent' : 
//                                      property.ownershipType === 'dealer' ? 'Property Dealer' :
//                                      property.ownershipType === 'builder' ? 'Builder/Developer' :
//                                      'Property Owner'}
//                                 </p>
//                                 <p>
//                                     <strong>Phone:</strong> 
//                                     {(property.owner.phone || property.owner.mobile || property.owner.contactNumber) ? (
//                                         <a href={`tel:${property.owner.phone || property.owner.mobile || property.owner.contactNumber}`}>
//                                             {property.owner.phone || property.owner.mobile || property.owner.contactNumber}
//                                         </a>
//                                     ) : 'Not provided'}
//                                 </p>
//                                 <p>
//                                     <strong>Email:</strong> 
//                                     {property.owner.email ? (
//                                         <a href={`mailto:${property.owner.email}`}>
//                                             {property.owner.email}
//                                         </a>
//                                     ) : 'Not provided'}
//                                 </p>
//                                 <p>
//                                     <strong>Member Since:</strong> 
//                                     {new Date(property.owner.createdAt).getFullYear()}
//                                 </p>
//                             </div>
//                             <div className="modal-actions">
//                                 <a 
//                                     href={`tel:${property.owner.phone || property.owner.mobile || property.owner.contactNumber}`}
//                                     className="action-btn call-btn"
//                                 >
//                                     <i className="fas fa-phone"></i> Call Now
//                                 </a>
//                                 <a 
//                                     href={`mailto:${property.owner.email}`}
//                                     className="action-btn email-btn"
//                                 >
//                                     <i className="fas fa-envelope"></i> Email
//                                 </a>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default PropertyDetail;


// src/pages/PropertyDetail.js - Combined Design with Backend Integration
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import './PropertyDetail.css';

const PropertyDetail = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [property, setProperty] = useState(null);
    const [similarProperties, setSimilarProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);

    // State for the new contact form
    const [contactName, setContactName] = useState('');
    const [contactPhone, setContactPhone] = useState('');
    const [contactEmail, setContactEmail] = useState('');
    const [contactMessage, setContactMessage] = useState('Hello, I am interested in this property.');

    useEffect(() => {
        const fetchAllData = async () => {
            setLoading(true);
            window.scrollTo(0, 0);

        try {
            const response = await fetch(`http://localhost:5000/api/properties/${slug}`);
            const data = await response.json();
            
            if (data.success) {
                    const currentProperty = data.data;
                    setProperty(currentProperty);
                    fetchSimilarProperties(currentProperty); // Pass current property to fetch similar ones
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
        fetchAllData();
    }, [slug, navigate]);

    const fetchSimilarProperties = async (currentProperty) => {
        if (!currentProperty) return;
        try {
            let similar = [];
            
            // Step 1: Same City + Same Subcategory (e.g., penthouse in Mumbai)
            console.log('🔍 Step 1: Looking for same city + same subcategory...');
            let response = await fetch(`http://localhost:5000/api/properties?limit=10&city=${encodeURIComponent(currentProperty.city)}&subCategoryId=${currentProperty.subCategoryId}`);
            let data = await response.json();
            
            if (data.success && data.data.properties && data.data.properties.length > 0) {
                similar = data.data.properties
                    .filter(p => p.slug !== slug)
                    .slice(0, 6);
                console.log(`✅ Found ${similar.length} properties with same city + subcategory`);
            }
            
            // Step 2: If not enough, get any properties from same city
            if (similar.length < 6) {
                console.log('🔍 Step 2: Looking for any properties in same city...');
                response = await fetch(`http://localhost:5000/api/properties?limit=10&city=${encodeURIComponent(currentProperty.city)}`);
                data = await response.json();
                
                if (data.success && data.data.properties) {
                    const cityProperties = data.data.properties
                        .filter(p => p.slug !== slug && !similar.find(s => s.id === p.id))
                        .slice(0, 6 - similar.length);
                    
                    similar = [...similar, ...cityProperties];
                    console.log(`✅ Added ${cityProperties.length} more properties from same city. Total: ${similar.length}`);
                }
            }
            
            // Step 3: If still not enough, get properties from same subcategory (any city)
            if (similar.length < 6) {
                console.log('🔍 Step 3: Looking for same subcategory from any city...');
                response = await fetch(`http://localhost:5000/api/properties?limit=10&subCategoryId=${currentProperty.subCategoryId}`);
                data = await response.json();
                
                if (data.success && data.data.properties) {
                    const subcategoryProperties = data.data.properties
                        .filter(p => p.slug !== slug && !similar.find(s => s.id === p.id))
                        .slice(0, 6 - similar.length);
                    
                    similar = [...similar, ...subcategoryProperties];
                    console.log(`✅ Added ${subcategoryProperties.length} more properties from same subcategory. Total: ${similar.length}`);
                }
            }
            
            // Step 4: If still not enough, get properties from same category (any city)
            if (similar.length < 6) {
                console.log('🔍 Step 4: Looking for same category from any city...');
                response = await fetch(`http://localhost:5000/api/properties?limit=10&categoryId=${currentProperty.categoryId}`);
                data = await response.json();
                
                if (data.success && data.data.properties) {
                    const categoryProperties = data.data.properties
                        .filter(p => p.slug !== slug && !similar.find(s => s.id === p.id))
                        .slice(0, 6 - similar.length);
                    
                    similar = [...similar, ...categoryProperties];
                    console.log(`✅ Added ${categoryProperties.length} more properties from same category. Total: ${similar.length}`);
                }
            }
            
            console.log(`🎯 Final similar properties count: ${similar.length}`);
            setSimilarProperties(similar);
        } catch (error) {
            console.error('Error fetching similar properties:', error);
        }
    };

    // Price format for both new and old sections
    const formatPrice = (price) => {
        if (price === null || price === undefined) return 'N/A';
        return `$${price.toLocaleString()}`;
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loader"></div>
            </div>
        );
    }

    if (!property) {
        return (
             <div className="loading-container">
                <h2>Property Not Found</h2>
            </div>
        );
    }

    return (
        <div className="property-detail-page">
            {/* === PART 1: Your Original Image Gallery (Kept as is) === */}
            <div className="full-width-gallery">
                <div className="main-image-container">
                    <img 
                        src={property.images && property.images[selectedImage]?.imageUrl ? 
                            `http://localhost:5000${property.images[selectedImage].imageUrl}` : 
                            '/default-property.jpg'} 
                        alt={property.title} 
                        className="main-image"
                    />
                    
                    {property.images && property.images.length > 1 && (
                        <>
                            <button 
                                className="image-nav prev"
                                onClick={() => setSelectedImage(prev => prev > 0 ? prev - 1 : property.images.length - 1)}
                            >
                                <i className="fas fa-chevron-left"></i>
                            </button>
                            <button 
                                className="image-nav next"
                                onClick={() => setSelectedImage(prev => prev < property.images.length - 1 ? prev + 1 : 0)}
                            >
                                <i className="fas fa-chevron-right"></i>
                            </button>
                            <div className="image-counter">
                                {selectedImage + 1} / {property.images.length}
                            </div>
                        </>
                    )}
                </div>
                
                {property.images && property.images.length > 1 && (
                    <div className="image-thumbnails">
                        <div className="thumbnail-scroll-container">
                        {property.images.map((image, index) => (
                                <img
                                    key={index}
                                    src={`http://localhost:5000${image.imageUrl}`}
                                    alt={`Thumbnail ${index + 1}`}
                                className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                                onClick={() => setSelectedImage(index)}
                                />
                            ))}
                            </div>
                    </div>
                )}
            </div>

            {/* === PART 2: New Content Layout (As per your screenshots) === */}
            <div className="property-detail-container">
                {/* Left Column - Main Content */}
                <div className="property-main-content">
                    <div className="card-panel">
                    {/* Property Header */}
                        <div className="property-header-new">
                            <div className="title-price">
                            <h1>{property.title}</h1>
                                <span className="price">
                                    {formatPrice(property.price)}
                                    <span className="price-period">/month</span>
                                </span>
                            </div>
                            <div className="location-bar">
                                <i className="fas fa-map-marker-alt"></i>
                                <span>{`${property.address}, ${property.city}, ${property.state}`}</span>
                            </div>
                            <div className="stats-bar">
                                <div className="stats-main">
                                    {property.bedrooms && <span><i className="fas fa-bed"></i> Beds: {property.bedrooms}</span>}
                                    {property.bathrooms && <span><i className="fas fa-bath"></i> Baths: {property.bathrooms}</span>}
                                    {property.superArea && <span><i className="fas fa-ruler-combined"></i> Sqft: {property.superArea}</span>}
                                </div>
                                <div className="stats-actions">
                                    <button className="action-btn" title="Save"><i className="far fa-heart"></i></button>
                                    <button className="action-btn" title="Share"><i className="fas fa-share-alt"></i></button>
                                    <button className="action-btn" title="Print"><i className="fas fa-print"></i></button>
                        </div>
                            </div>
                        </div>
                        
                        {/* Description Section */}
                        <div className="description-section-new">
                            <h3>Description</h3>
                            <p>{property.description || 'A beautiful property with modern amenities and a prime location, offering the perfect blend of comfort and convenience for families and professionals alike.'}</p>
                            <button className="view-more-btn">View More</button>
                        </div>
                        
                        {/* Overview Section */}
                        <div className="overview-section-new">
                            <h3>Overview</h3>
                            <div className="overview-grid-new">
                                <div className="overview-item-new"><i className="fas fa-home"></i><div><span>ID:</span><strong>{property.id?.slice(-4) || 'N/A'}</strong></div></div>
                                <div className="overview-item-new"><i className="fas fa-building"></i><div><span>Type:</span><strong>{property.subcategory?.name || 'House'}</strong></div></div>
                                <div className="overview-item-new"><i className="fas fa-car"></i><div><span>Garages:</span><strong>{property.features?.parking === 'none' ? '0' : '1'}</strong></div></div>
                                <div className="overview-item-new"><i className="fas fa-bed"></i><div><span>Bedrooms:</span><strong>{property.bedrooms ? `${property.bedrooms} Rooms` : 'N/A'}</strong></div></div>
                                <div className="overview-item-new"><i className="fas fa-bath"></i><div><span>Bathrooms:</span><strong>{property.bathrooms ? `${property.bathrooms} Rooms` : 'N/A'}</strong></div></div>
                                <div className="overview-item-new"><i className="fas fa-expand-arrows-alt"></i><div><span>Land Size:</span><strong>{property.superArea ? `${property.superArea} SqFt` : 'N/A'}</strong></div></div>
                                <div className="overview-item-new"><i className="fas fa-hammer"></i><div><span>Year Built:</span><strong>{property.ageOfProperty === 'new' ? new Date().getFullYear() : 'N/A'}</strong></div></div>
                                <div className="overview-item-new"><i className="fas fa-ruler"></i><div><span>Size:</span><strong>{property.carpetArea ? `${property.carpetArea} SqFt` : 'N/A'}</strong></div></div>
                        </div>
                    </div>

                        {/* Amenities Section */}
                        <div className="amenities-section-new">
                            <h3>Amenities & Features</h3>
                            {property.features && Object.keys(property.features).some(key => property.features[key] === true || (property.features[key] && property.features[key] !== 'none')) ? (
                                <div className="amenities-grid-new">
                                    {property.features.lift && <div className="amenity-item-new"><i className="fas fa-elevator"></i><span>Lift</span></div>}
                                    {property.features.parking && property.features.parking !== 'none' && (
                                        <div className="amenity-item-new"><i className="fas fa-car"></i><span>Parking ({property.features.parking})</span></div>
                                    )}
                                    {property.features.security && <div className="amenity-item-new"><i className="fas fa-shield-alt"></i><span>24x7 Security</span></div>}
                                    {property.features.powerBackup && property.features.powerBackup !== 'none' && (
                                        <div className="amenity-item-new"><i className="fas fa-bolt"></i><span>Power Backup ({property.features.powerBackup})</span></div>
                                    )}
                                    {property.features.waterSupply && property.features.waterSupply !== 'none' && (
                                        <div className="amenity-item-new"><i className="fas fa-tint"></i><span>Water Supply ({property.features.waterSupply})</span></div>
                                    )}
                                    {property.features.cctv && <div className="amenity-item-new"><i className="fas fa-video"></i><span>CCTV</span></div>}
                                    {property.features.gasConnection && <div className="amenity-item-new"><i className="fas fa-fire"></i><span>Gas Pipeline</span></div>}
                                    {property.features.petFriendly && <div className="amenity-item-new"><i className="fas fa-paw"></i><span>Pet Friendly</span></div>}
                                    {property.features.vastu && <div className="amenity-item-new"><i className="fas fa-compass"></i><span>Vastu Compliant</span></div>}
                                    {property.features.intercom && <div className="amenity-item-new"><i className="fas fa-phone"></i><span>Intercom</span></div>}
                                    {property.features.visitorParking && <div className="amenity-item-new"><i className="fas fa-car"></i><span>Visitor Parking</span></div>}
                                    {property.features.gym && <div className="amenity-item-new"><i className="fas fa-dumbbell"></i><span>Gym</span></div>}
                                    {property.features.swimmingPool && <div className="amenity-item-new"><i className="fas fa-swimming-pool"></i><span>Swimming Pool</span></div>}
                                    {property.features.clubHouse && <div className="amenity-item-new"><i className="fas fa-home"></i><span>Club House</span></div>}
                                    {property.features.playArea && <div className="amenity-item-new"><i className="fas fa-child"></i><span>Children's Play Area</span></div>}
                                    {property.features.garden && <div className="amenity-item-new"><i className="fas fa-seedling"></i><span>Garden</span></div>}
                    </div>
                            ) : (
                                <div className="no-amenities-new">
                                    <i className="fas fa-info-circle"></i>
                                    <p>No amenities information available for this property.</p>
                            </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column - Sidebar */}
                <div className="property-sidebar">
                    <div className="card-panel contact-seller-card">
                        <h3>Contact Seller</h3>
                        {property.owner && (
                            <div className="seller-profile">
                                <div className="seller-avatar">{property.owner.firstName?.charAt(0)}{property.owner.lastName?.charAt(0)}</div>
                                <div className="seller-details">
                                <h4>{`${property.owner.firstName} ${property.owner.lastName}`}</h4>
                                    {property.owner.phoneNumber && <div className="seller-contact-item"><i className="fas fa-phone-alt"></i><span>{property.owner.phoneNumber}</span></div>}
                                    {property.owner.email && <div className="seller-contact-item"><i className="fas fa-envelope"></i><span>{property.owner.email}</span></div>}
                                    {property.owner.address && <div className="seller-contact-item"><i className="fas fa-map-marker-alt"></i><span>{property.owner.address}{property.owner.city && `, ${property.owner.city}`}{property.owner.state && `, ${property.owner.state}`}</span></div>}
                                </div>
                            </div>
                        )}

                        <form className="contact-form-new" onSubmit={(e) => e.preventDefault()}>
                            <div className="input-group"><input type="text" value={contactName} onChange={(e) => setContactName(e.target.value)} placeholder="Your Name" required /></div>
                            <div className="input-group"><input type="tel" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} placeholder="Phone Number" /></div>
                            <div className="input-group"><input type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} placeholder="Email Address" required /></div>
                            <div className="input-group"><textarea value={contactMessage} onChange={(e) => setContactMessage(e.target.value)} placeholder="Message" rows="4" required></textarea></div>
                            <button type="submit" className="send-message-btn">Send Message</button>
                        </form>
                    </div>
                    </div>
            </div>

            {/* Your Original Similar Properties Section */}
            {similarProperties.length > 0 && (
                <div className="similar-properties">
                    <div className="container">
                        <h2>Similar Properties</h2>
                        <div className="similar-properties-wrapper">
                            <div className="similar-properties-scroll" id="similarPropertiesScroll">
                                {similarProperties.map(prop => (
                                    <Link key={prop.id} to={`/property/${prop.slug}`} className="similar-property-card">
                                        <div className="property-image"><img src={prop.images && prop.images[0]?.imageUrl ? `http://localhost:5000${prop.images[0].imageUrl}` : '/default-property.jpg'} alt={prop.title} /></div>
                                        <div className="property-info">
                                            <h4>{prop.title}</h4>
                                            <p className="property-location"><i className="fas fa-map-marker-alt"></i>{prop.locality}, {prop.city}</p>
                                            <div className="property-specs">
                                                {prop.bedrooms && <span>{prop.bedrooms} BHK</span>}
                                                {prop.superArea && <span>{prop.superArea} sqft</span>}
                        </div>
                                            <div className="property-price-tag">{formatPrice(prop.price)}</div>
                            </div>
                                    </Link>
                                ))}
                            </div>
                            <button className="carousel-nav prev" onClick={() => { document.getElementById('similarPropertiesScroll').scrollBy({ left: -300, behavior: 'smooth' }); }}><i className="fas fa-chevron-left"></i></button>
                            <button className="carousel-nav next" onClick={() => { document.getElementById('similarPropertiesScroll').scrollBy({ left: 300, behavior: 'smooth' }); }}><i className="fas fa-chevron-right"></i></button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PropertyDetail;