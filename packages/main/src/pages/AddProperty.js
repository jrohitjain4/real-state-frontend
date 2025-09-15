// src/pages/AddProperty.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddProperty.css';

const AddProperty = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [loading, setLoading] = useState(false);
    
    const [propertyData, setPropertyData] = useState({
        // Basic Info
        categoryId: '',
        subCategoryId: '',
        propertyConfiguration: '', // Changed from configId
        title: '',
        description: '',
        
        // Location
        address: '',
        locality: '',
        landmark: '',
        city: '',
        state: '',
        pincode: '',
        latitude: '',
        longitude: '',
        
        // Property Details
        bedrooms: 0,
        bathrooms: 1,
        balconies: 1,
        floorNumber: '',
        totalFloors: '',
        
        // Area
        superArea: '',
        builtUpArea: '',
        carpetArea: '',
        
        // Pricing
        price: '',
        priceUnit: 'total',
        negotiable: true,
        maintenanceCharge: '',
        rentAmount: '',
        securityDeposit: '',
        
        // Other Details
        furnishingStatus: 'unfurnished',
        possessionStatus: 'ready-to-move',
        availableFrom: new Date().toISOString().split('T')[0],
        ageOfProperty: 'new',
        ownershipType: 'owner',
        
        // Features
        features: {
            parking: 'none',
            parkingCount: 0,
            powerBackup: 'none',
            waterSupply: 'corporation',
            lift: false,
            gym: false,
            swimmingPool: false,
            clubHouse: false,
            security: false,
            playArea: false,
            cctv: false,
            gasConnection: false,
            vastu: false,
            petFriendly: false,
            intercom: false,
            visitorParking: false
        }
    });

    const [images, setImages] = useState([]);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        fetchCategories();
        checkProfileCompletion();
    }, []);

    const checkProfileCompletion = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/data/profile-status', {
                headers: {
                    'x-auth-token': localStorage.getItem('token')
                }
            });
            
            const data = await response.json();
            if (data.success && !data.user.profileCompleted) {
                alert('Please complete your profile before posting a property');
                navigate('/complete-profile');
            }
        } catch (error) {
            console.error('Error checking profile:', error);
        }
    };

    const fetchCategories = async () => {
        try {
            console.log('Fetching categories from API...');
            const response = await fetch('http://localhost:5000/api/categories');
            console.log('Response status:', response.status);
            const data = await response.json();
            console.log('API response:', data);
            if (data.success) {
                setCategories(data.data);
                console.log('Categories set:', data.data);
            } else {
                console.error('API returned success: false', data.message);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };
// Update the handleCategoryChange function
// Update your handleCategoryChange function in AddProperty.js
const handleCategoryChange = async (categoryId) => {
    console.log('Category changed to:', categoryId);
    
    setPropertyData({ 
        ...propertyData, 
        categoryId, 
        subCategoryId: '', 
        propertyConfiguration: '' 
    });
    
    // Clear existing subcategories
    setSubcategories([]);
    
    if (categoryId) {
        try {
            // Fetch subcategories for the selected category
            console.log(`Fetching subcategories for category ${categoryId}`);
            const response = await fetch(`http://localhost:5000/api/categories/${categoryId}/subcategories`);
            const data = await response.json();
            
            console.log('Subcategories response:', data);
            
            if (data.success && data.data) {
                setSubcategories(data.data);
                console.log('Subcategories set:', data.data);
            } else {
                console.error('No subcategories found');
                setSubcategories([]);
            }
        } catch (error) {
            console.error('Error fetching subcategories:', error);
            setSubcategories([]);
        }
    }
};

const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
        const [parent, child] = name.split('.');
        setPropertyData({
            ...propertyData,
            [parent]: {
                ...propertyData[parent],
                [child]: type === 'checkbox' ? checked : value
            }
        });
    } else {
        // Convert numeric fields
        const numericFields = ['bathrooms', 'balconies', 'totalFloors', 'superArea', 'builtUpArea', 'carpetArea', 'price', 'maintenanceCharge'];
        let finalValue = type === 'checkbox' ? checked : value;
        
        if (numericFields.includes(name) && value !== '') {
            finalValue = parseInt(value) || 0;
        }
        
        setPropertyData({
            ...propertyData,
            [name]: finalValue
        });
    }
};

    // Update property configuration based on bedrooms selection
    const handleBedroomsChange = (e) => {
        const bedrooms = e.target.value;
        let configuration = '';
        
        if (bedrooms === '0') {
            configuration = 'Studio';
        } else if (bedrooms === '5') {
            configuration = '5+ BHK';
        } else {
            configuration = `${bedrooms} BHK`;
        }
        
        setPropertyData({
            ...propertyData,
            bedrooms: parseInt(bedrooms),
            propertyConfiguration: configuration
        });
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        
        // Validate file size and type
        const validFiles = files.filter(file => {
            if (file.size > 5 * 1024 * 1024) {
                alert(`${file.name} is too large. Maximum size is 5MB`);
                return false;
            }
            return true;
        });

        setImages([...images, ...validFiles]);
    };

    const removeImage = (index) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const validateStep = () => {
        const newErrors = {};
        
        switch(step) {
            case 1:
                if (!propertyData.categoryId) newErrors.categoryId = 'Please select a category';
                if (!propertyData.subCategoryId) newErrors.subCategoryId = 'Please select a property type';
                if (!propertyData.title) newErrors.title = 'Title is required';
                if (!propertyData.description || propertyData.description.length < 50) {
                    newErrors.description = 'Description must be at least 50 characters';
                }
                break;
                
            case 2:
                if (!propertyData.address) newErrors.address = 'Address is required';
                if (!propertyData.locality) newErrors.locality = 'Locality is required';
                if (!propertyData.city) newErrors.city = 'City is required';
                if (!propertyData.state) newErrors.state = 'State is required';
                if (!propertyData.pincode || !/^\d{6}$/.test(propertyData.pincode)) {
                    newErrors.pincode = 'Valid 6-digit pincode is required';
                }
                break;
                
            case 3:
                if (!propertyData.superArea || propertyData.superArea <= 0) {
                    newErrors.superArea = 'Super area is required';
                }
                if (!propertyData.price || propertyData.price <= 0) {
                    newErrors.price = 'Price is required';
                }
                break;
                
            case 4:
                if (images.length === 0) {
                    newErrors.images = 'At least one image is required';
                }
                break;
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateStep()) {
            setStep(step + 1);
        }
    };

    const handleSubmit = async () => {
        if (!validateStep()) return;
        
        setLoading(true);
        
        try {
            // Clean up the data before sending
            const propertyPayload = {
                ...propertyData,
                // Ensure numeric values
                bedrooms: parseInt(propertyData.bedrooms) || 1,
                bathrooms: parseInt(propertyData.bathrooms) || 1,
                balconies: parseInt(propertyData.balconies) || 0,
                totalFloors: propertyData.totalFloors ? parseInt(propertyData.totalFloors) : null,
                superArea: parseInt(propertyData.superArea) || 0,
                builtUpArea: propertyData.builtUpArea ? parseInt(propertyData.builtUpArea) : null,
                carpetArea: propertyData.carpetArea ? parseInt(propertyData.carpetArea) : null,
                price: parseFloat(propertyData.price) || 0,
                maintenanceCharge: propertyData.maintenanceCharge ? parseFloat(propertyData.maintenanceCharge) : null,
                // Remove empty strings for optional fields
                latitude: propertyData.latitude || null,
                longitude: propertyData.longitude || null,
                floorNumber: propertyData.floorNumber || null,
                rentAmount: propertyData.rentAmount ? parseFloat(propertyData.rentAmount) : null,
                securityDeposit: propertyData.securityDeposit ? parseFloat(propertyData.securityDeposit) : null
            };
            
            console.log('Sending property data:', propertyPayload);
            
            // First create property
            const response = await fetch('http://localhost:5000/api/properties', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': localStorage.getItem('token')
                },
                body: JSON.stringify(propertyPayload)
            });
            
            const data = await response.json();
            console.log('Server response:', data);
            
            if (!data.success) {
                throw new Error(data.message || data.error);
            }
            
            // Upload images code remains the same...
            
        } catch (error) {
            console.error('Error posting property:', error);
            alert(error.message || 'Failed to post property');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="add-property-page">
            <div className="add-property-container">
                <div className="property-header">
                    <h2>Post Your Property</h2>
                    <p>Fill in the details to list your property</p>
                    
                    {/* Progress Steps */}
                    <div className="progress-steps">
                        <div className={`step ${step >= 1 ? 'active' : ''}`}>
                            <div className="step-number">1</div>
                            <span>Basic Info</span>
                        </div>
                        <div className={`step-line ${step >= 2 ? 'active' : ''}`}></div>
                        <div className={`step ${step >= 2 ? 'active' : ''}`}>
                            <div className="step-number">2</div>
                            <span>Location</span>
                        </div>
                        <div className={`step-line ${step >= 3 ? 'active' : ''}`}></div>
                        <div className={`step ${step >= 3 ? 'active' : ''}`}>
                            <div className="step-number">3</div>
                            <span>Details</span>
                        </div>
                        <div className={`step-line ${step >= 4 ? 'active' : ''}`}></div>
                        <div className={`step ${step >= 4 ? 'active' : ''}`}>
                            <div className="step-number">4</div>
                            <span>Images</span>
                        </div>
                    </div>
                </div>

                <form className="property-form" onSubmit={(e) => e.preventDefault()}>
                    {/* Step 1: Basic Information */}
                    {step === 1 && (
                        <div className="form-step">
                            <h3>Basic Information</h3>
                            
                            <div className="form-row">
                            <div className="form-group">
    <label>Property For *</label>
    <select
        name="categoryId"
        value={propertyData.categoryId}
        onChange={(e) => handleCategoryChange(e.target.value)}
        className={errors.categoryId ? 'error' : ''}
    >
        <option value="">Select Category</option>
        {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
        ))}
    </select>
    {errors.categoryId && <span className="error-message">{errors.categoryId}</span>}
</div>
                                
                                <div className="form-group">
    <label>Property Type *</label>
    <select
        name="subCategoryId"
        value={propertyData.subCategoryId}
        onChange={handleInputChange}
        className={errors.subCategoryId ? 'error' : ''}
        disabled={!propertyData.categoryId}
    >
        <option value="">Select Type</option>
        {subcategories && subcategories.length > 0 ? (
            subcategories.map(sub => (
                <option key={sub.id} value={sub.id}>{sub.name}</option>
            ))
        ) : (
            propertyData.categoryId && <option disabled>No types available</option>
        )}
    </select>
    {errors.subCategoryId && <span className="error-message">{errors.subCategoryId}</span>}
</div>
                            </div>
                            
                            <div className="form-group">
                                <label>Property Title *</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={propertyData.title}
                                    onChange={handleInputChange}
                                    placeholder="e.g., 2 BHK Apartment for Sale in Andheri West"
                                    className={errors.title ? 'error' : ''}
                                />
                                {errors.title && <span className="error-message">{errors.title}</span>}
                            </div>
                            
                            <div className="form-group">
                                <label>Description *</label>
                                <textarea
                                    name="description"
                                    value={propertyData.description}
                                    onChange={handleInputChange}
                                    rows="5"
                                    placeholder="Describe your property in detail..."
                                    className={errors.description ? 'error' : ''}
                                />
                                <small>{propertyData.description.length}/500 characters</small>
                                {errors.description && <span className="error-message">{errors.description}</span>}
                            </div>
                            <button 
            type="button" 
            onClick={async () => {
                console.log('Current categories:', categories);
                console.log('Current subcategories:', subcategories);
                
                // Test API endpoints
                try {
                    const catResponse = await fetch('http://localhost:5000/api/categories');
                    const catData = await catResponse.json();
                    console.log('Categories API response:', catData);
                    
                    if (catData.data && catData.data[0]) {
                        const subResponse = await fetch(`http://localhost:5000/api/categories/${catData.data[0].id}/subcategories`);
                        const subData = await subResponse.json();
                        console.log(`Subcategories for category ${catData.data[0].id}:`, subData);
                    }
                } catch (error) {
                    console.error('API test error:', error);
                }
            }}
            style={{ marginBottom: '20px', backgroundColor: '#ff0000', color: '#fff', padding: '10px' }}
        >
            Test API (Check Console)
        </button>
                        </div>

                        
                    )}

                    {/* Step 2: Location Details */}
                    {step === 2 && (
                        <div className="form-step">
                            <h3>Location Details</h3>
                            
                            <div className="form-group">
                                <label>Full Address *</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={propertyData.address}
                                    onChange={handleInputChange}
                                    placeholder="Building/Street/Area"
                                    className={errors.address ? 'error' : ''}
                                />
                                {errors.address && <span className="error-message">{errors.address}</span>}
                            </div>
                            
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Locality *</label>
                                    <input
                                        type="text"
                                        name="locality"
                                        value={propertyData.locality}
                                        onChange={handleInputChange}
                                        placeholder="e.g., Andheri West"
                                        className={errors.locality ? 'error' : ''}
                                    />
                                    {errors.locality && <span className="error-message">{errors.locality}</span>}
                                </div>
                                
                                <div className="form-group">
                                    <label>Landmark</label>
                                    <input
                                        type="text"
                                        name="landmark"
                                        value={propertyData.landmark}
                                        onChange={handleInputChange}
                                        placeholder="Nearby landmark"
                                    />
                                </div>
                            </div>
                            
                            <div className="form-row">
                                <div className="form-group">
                                    <label>City *</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={propertyData.city}
                                        onChange={handleInputChange}
                                        placeholder="Mumbai"
                                        className={errors.city ? 'error' : ''}
                                    />
                                    {errors.city && <span className="error-message">{errors.city}</span>}
                                </div>
                                
                                <div className="form-group">
                                    <label>State *</label>
                                    <input
                                        type="text"
                                        name="state"
                                        value={propertyData.state}
                                        onChange={handleInputChange}
                                        placeholder="Maharashtra"
                                        className={errors.state ? 'error' : ''}
                                    />
                                    {errors.state && <span className="error-message">{errors.state}</span>}
                                </div>
                                
                                <div className="form-group">
                                    <label>Pincode *</label>
                                    <input
                                        type="text"
                                        name="pincode"
                                        value={propertyData.pincode}
                                        onChange={handleInputChange}
                                        placeholder="400001"
                                        maxLength="6"
                                        className={errors.pincode ? 'error' : ''}
                                    />
                                    {errors.pincode && <span className="error-message">{errors.pincode}</span>}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Property Details */}
                    {step === 3 && (
                        <div className="form-step">
                            <h3>Property Details</h3>
                            
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Bedrooms</label>
                                    <select 
                                        name="bedrooms" 
                                        value={propertyData.bedrooms} 
                                        onChange={handleBedroomsChange}
                                    >
                                        <option value="0">Studio</option>
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                        <option value="4">4</option>
                                        <option value="5">5+</option>
                                    </select>
                                </div>
                                
                                <div className="form-group">
                                    <label>Bathrooms</label>
                                    <select name="bathrooms" value={propertyData.bathrooms} onChange={handleInputChange}>
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                        <option value="4">4+</option>
                                    </select>
                                </div>
                                
                                <div className="form-group">
                                    <label>Balconies</label>
                                    <select name="balconies" value={propertyData.balconies} onChange={handleInputChange}>
                                        <option value="0">0</option>
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3+</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Floor Number</label>
                                    <input
                                        type="text"
                                        name="floorNumber"
                                        value={propertyData.floorNumber}
                                        onChange={handleInputChange}
                                        placeholder="e.g., 3 or Ground"
                                    />
                                </div>
                                
                                <div className="form-group">
                                    <label>Total Floors</label>
                                    <input
                                        type="number"
                                        name="totalFloors"
                                        value={propertyData.totalFloors}
                                        onChange={handleInputChange}
                                        placeholder="e.g., 12"
                                    />
                                </div>
                            </div>
                            
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Super Built-up Area (sq ft) *</label>
                                    <input
                                        type="number"
                                        name="superArea"
                                        value={propertyData.superArea}
                                        onChange={handleInputChange}
                                        placeholder="e.g., 1200"
                                        className={errors.superArea ? 'error' : ''}
                                    />
                                    {errors.superArea && <span className="error-message">{errors.superArea}</span>}
                                </div>
                                
                                <div className="form-group">
                                    <label>Carpet Area (sq ft)</label>
                                    <input
                                        type="number"
                                        name="carpetArea"
                                        value={propertyData.carpetArea}
                                        onChange={handleInputChange}
                                        placeholder="e.g., 1000"
                                    />
                                </div>
                            </div>
                            
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Expected Price (₹) *</label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={propertyData.price}
                                        onChange={handleInputChange}
                                        placeholder="e.g., 1500000"
                                        className={errors.price ? 'error' : ''}
                                    />
                                    {errors.price && <span className="error-message">{errors.price}</span>}
                                </div>
                                
                                <div className="form-group">
                                    <label>Maintenance Charge (₹/month)</label>
                                    <input
                                        type="number"
                                        name="maintenanceCharge"
                                        value={propertyData.maintenanceCharge}
                                        onChange={handleInputChange}
                                        placeholder="e.g., 3000"
                                    />
                                </div>
                            </div>
                            
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Furnishing Status</label>
                                    <select name="furnishingStatus" value={propertyData.furnishingStatus} onChange={handleInputChange}>
                                        <option value="unfurnished">Unfurnished</option>
                                        <option value="semi-furnished">Semi-Furnished</option>
                                        <option value="furnished">Fully Furnished</option>
                                    </select>
                                </div>
                                
                                <div className="form-group">
                                    <label>Possession Status</label>
                                    <select name="possessionStatus" value={propertyData.possessionStatus} onChange={handleInputChange}>
                                        <option value="ready-to-move">Ready to Move</option>
                                        <option value="under-construction">Under Construction</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Property Age</label>
                                    <select name="ageOfProperty" value={propertyData.ageOfProperty} onChange={handleInputChange}>
                                        <option value="new">New Construction</option>
                                        <option value="1-3years">1-3 Years</option>
                                        <option value="3-5years">3-5 Years</option>
                                        <option value="5-10years">5-10 Years</option>
                                        <option value="10plus">10+ Years</option>
                                    </select>
                                </div>
                                
                                <div className="form-group">
                                    <label>Ownership Type</label>
                                    <select name="ownershipType" value={propertyData.ownershipType} onChange={handleInputChange}>
                                        <option value="owner">Owner</option>
                                        <option value="dealer">Dealer</option>
                                        <option value="builder">Builder</option>
                                    </select>
                                </div>
                            </div>
                            
                            {/* Amenities */}
                            <h4>Amenities</h4>
                            <div className="amenities-grid">
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        name="features.lift"
                                        checked={propertyData.features.lift}
                                        onChange={handleInputChange}
                                    />
                                    <span>Lift</span>
                                </label>
                                
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        name="features.security"
                                        checked={propertyData.features.security}
                                        onChange={handleInputChange}
                                    />
                                    <span>24x7 Security</span>
                                </label>
                                
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        name="features.gym"
                                        checked={propertyData.features.gym}
                                        onChange={handleInputChange}
                                    />
                                    <span>Gym</span>
                                </label>
                                
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        name="features.swimmingPool"
                                        checked={propertyData.features.swimmingPool}
                                        onChange={handleInputChange}
                                    />
                                    <span>Swimming Pool</span>
                                </label>
                                
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        name="features.clubHouse"
                                        checked={propertyData.features.clubHouse}
                                        onChange={handleInputChange}
                                    />
                                    <span>Club House</span>
                                </label>
                                
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        name="features.playArea"
                                        checked={propertyData.features.playArea}
                                        onChange={handleInputChange}
                                    />
                                    <span>Children's Play Area</span>
                                </label>
                                
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        name="features.cctv"
                                        checked={propertyData.features.cctv}
                                        onChange={handleInputChange}
                                    />
                                    <span>CCTV Surveillance</span>
                                </label>
                                
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        name="features.petFriendly"
                                        checked={propertyData.features.petFriendly}
                                        onChange={handleInputChange}
                                    />
                                    <span>Pet Friendly</span>
                                </label>
                                
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        name="features.gasConnection"
                                        checked={propertyData.features.gasConnection}
                                        onChange={handleInputChange}
                                    />
                                    <span>Gas Pipeline</span>
                                </label>
                                
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        name="features.vastu"
                                        checked={propertyData.features.vastu}
                                        onChange={handleInputChange}
                                    />
                                    <span>Vastu Compliant</span>
                                </label>
                                
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        name="features.intercom"
                                        checked={propertyData.features.intercom}
                                        onChange={handleInputChange}
                                    />
                                    <span>Intercom Facility</span>
                                </label>
                                
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        name="features.visitorParking"
                                        checked={propertyData.features.visitorParking}
                                        onChange={handleInputChange}
                                    />
                                    <span>Visitor Parking</span>
                                </label>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Images */}
                    {step === 4 && (
                        <div className="form-step">
                            <h3>Property Images</h3>
                            <p className="step-description">Add photos of your property (Max 10 images, 5MB each)</p>
                            
                            <div className="image-upload-section">
                                <label className="image-upload-label">
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        disabled={images.length >= 10}
                                    />
                                    <div className="upload-placeholder">
                                        <i className="fas fa-cloud-upload-alt"></i>
                                        <span>Click to upload images</span>
                                    </div>
                                </label>
                                
                                {errors.images && <span className="error-message">{errors.images}</span>}
                                
                                <div className="image-preview-grid">
                                    {images.map((image, index) => (
                                        <div key={index} className="image-preview">
                                            <img src={URL.createObjectURL(image)} alt={`Preview ${index}`} />
                                            <button 
                                                type="button" 
                                                className="remove-image"
                                                onClick={() => removeImage(index)}
                                            >
                                                ×
                                            </button>
                                            {index === 0 && <span className="primary-badge">Primary</span>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Form Actions */}
                    <div className="form-actions">
                        {step > 1 && (
                            <button 
                                type="button" 
                                className="back-button"
                                onClick={() => setStep(step - 1)}
                            >
                                Back
                            </button>
                        )}
                        
                        {step < 4 ? (
                            <button 
                                type="button" 
                                className="next-button"
                                onClick={handleNext}
                            >
                                Next
                            </button>
                        ) : (
                            <button 
                                type="button" 
                                className="submit-button"
                                onClick={handleSubmit}
                                disabled={loading}
                            >
                                {loading ? 'Posting Property...' : 'Post Property'}
                            </button>
                        )}
                    </div>
                </form>
                </div>
        </div>
    );
};

export default AddProperty;