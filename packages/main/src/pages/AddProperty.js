// src/pages/AddProperty.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { propertyFormConfig, fieldDefinitions } from '../config/propertyFormConfig';
import './AddProperty.css';

const AddProperty = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedPropertyType, setSelectedPropertyType] = useState('residential');
    
    // Dynamic property data state based on property type
    const [propertyData, setPropertyData] = useState({
        // Basic Info
        categoryId: '',
        subCategoryId: '',
        propertyConfiguration: '',
        property_for: 'residential', // User selects this first
        title: '',
        description: '',
        
        // Location (common for all)
        address: '',
        locality: '',
        landmark: '',
        city: '',
        state: '',
        pincode: '',
        latitude: '',
        longitude: '',
        
        // Dynamic fields based on property type
        // Residential fields
        bedrooms: 1,
        bathrooms: 1,
        balconies: 0,
        floorNumber: '',
        totalFloors: '',
        superArea: '',
        builtUpArea: '',
        carpetArea: '',
        
        // Land fields
        plotArea: '',
        plotLength: '',
        plotBreadth: '',
        plotFacing: 'North',
        roadWidth: '',
        openSides: '1',
        
        // Commercial fields
        washrooms: 1,
        frontage: '',
        
        // Farmhouse fields
        totalArea: '',
        openArea: '',
        
        // PG fields
        sharingType: 'Single',
        totalBeds: '',
        availableBeds: '',
        gateClosingTime: '',
        visitorPolicy: 'Limited Hours',
        noticePeriod: 30,
        
        // Pricing (common but varies)
        price: '',
        priceUnit: 'total',
        negotiable: true,
        maintenanceCharge: '',
        rentAmount: '',
        securityDeposit: '',
        
        // Other Details (varies by type)
        furnishingStatus: 'unfurnished',
        possessionStatus: 'ready-to-move',
        availableFrom: new Date().toISOString().split('T')[0],
        ageOfProperty: 'new',
        ownershipType: 'owner',
        
        // Features (dynamic based on property type)
        features: {}
    });

    const [images, setImages] = useState([]);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        // Check if user is authenticated
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Please login to add a property');
            navigate('/login');
            return;
        }
        
        fetchCategories();
        checkProfileCompletion();
    }, [navigate]);

    // Update property type when subcategory changes
    useEffect(() => {
        if (propertyData.subCategoryId && subcategories.length > 0) {
            const selectedSubcat = subcategories.find(sub => sub.id === parseInt(propertyData.subCategoryId));
            if (selectedSubcat && selectedSubcat.propertyType) {
                setSelectedPropertyType(selectedSubcat.propertyType);
                // Reset features based on new property type
                resetFeaturesForPropertyType(selectedSubcat.propertyType);
                
                // Update property_for based on subcategory if it's commercial
                if (selectedSubcat.name.toLowerCase().includes('godown') || 
                    selectedSubcat.name.toLowerCase().includes('commercial') ||
                    selectedSubcat.propertyType === 'commercial-land') {
                    setPropertyData(prev => ({
                        ...prev,
                        property_for: 'commercial'
                    }));
                }
            }
        }
    }, [propertyData.subCategoryId, subcategories]);

    // Handle property_for changes to refetch subcategories
    useEffect(() => {
        if (propertyData.categoryId && propertyData.property_for) {
            handleCategoryChange(propertyData.categoryId, propertyData.property_for);
        }
    }, [propertyData.property_for]);

    const resetFeaturesForPropertyType = (propertyType) => {
        const config = propertyFormConfig[propertyType];
        const newFeatures = {};
        
        if (config && config.amenities) {
            config.amenities.forEach(amenity => {
                newFeatures[amenity] = false;
            });
        }
        
        setPropertyData(prev => ({
            ...prev,
            features: newFeatures
        }));
    };

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
            const response = await fetch('http://localhost:5000/api/categories');
            const data = await response.json();
            if (data.success) {
                setCategories(data.data);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const handleCategoryChange = async (categoryId, propertyFor = null) => {
        const currentPropertyFor = propertyFor || propertyData.property_for;
        
        // Only update categoryId if it's different
        if (categoryId !== propertyData.categoryId) {
            setPropertyData(prev => ({ 
                ...prev, 
                categoryId, 
                subCategoryId: '', 
                propertyConfiguration: ''
            }));
        }
        
        setSubcategories([]);
        
        if (categoryId) {
            try {
                const response = await fetch(`http://localhost:5000/api/categories/${categoryId}/subcategories`);
                const data = await response.json();
                
                if (data.success && data.data) {
                    // Filter subcategories based on property_for
                    const filteredSubcategories = data.data.filter(sub => {
                        if (currentPropertyFor === 'residential') {
                            // Show residential subcategories (exclude godown and commercial properties)
                            return !sub.name.toLowerCase().includes('godown') && 
                                   sub.propertyType !== 'commercial' &&
                                   sub.propertyType !== 'commercial-land';
                        } else if (currentPropertyFor === 'commercial') {
                            // Show commercial subcategories (include godown and land)
                            return sub.name.toLowerCase().includes('godown') || 
                                   sub.name.toLowerCase().includes('land') ||
                                   sub.propertyType === 'commercial' ||
                                   sub.propertyType === 'commercial-land';
                        }
                        return true;
                    });
                    setSubcategories(filteredSubcategories);
                }
            } catch (error) {
                console.error('Error fetching subcategories:', error);
            }
        }
    };

    // Filter categories to show only Buy, Sell, Rent, Lease
    const getFilteredCategories = () => {
        return categories.filter(cat => 
            ['buy', 'sell', 'rent', 'lease'].includes(cat.slug)
        );
    };

    const renderDynamicFields = () => {
        const actualPropertyType = getActualPropertyType();
        const config = propertyFormConfig[actualPropertyType];
        if (!config) return null;

        return (
            <>
                {/* Property Details Section */}
                {config.propertyDetails.length > 0 && (
                    <div className="form-section">
                        <h4>Property Details</h4>
                        <div className="form-row">
                            {config.propertyDetails.map(fieldName => {
                                const fieldDef = fieldDefinitions[fieldName];
                                if (!fieldDef) return renderStandardField(fieldName);
                                
                                return renderField(fieldName, fieldDef);
                            })}
                        </div>
                    </div>
                )}

                {/* Area Details Section */}
                {config.areaDetails.length > 0 && (
                    <div className="form-section">
                        <h4>Area Details</h4>
                        <div className="form-row">
                            {config.areaDetails.map(fieldName => {
                                const fieldDef = fieldDefinitions[fieldName];
                                if (!fieldDef) return renderStandardField(fieldName);
                                
                                return renderField(fieldName, fieldDef);
                            })}
                        </div>
                    </div>
                )}

                {/* Additional Info Section */}
                {config.additionalInfo.length > 0 && (
                    <div className="form-section">
                        <h4>Additional Information</h4>
                        <div className="form-row">
                            {config.additionalInfo.map(fieldName => {
                                const fieldDef = fieldDefinitions[fieldName];
                                if (!fieldDef) return renderStandardField(fieldName);
                                
                                return renderField(fieldName, fieldDef);
                            })}
                        </div>
                    </div>
                )}

                {/* Amenities Section */}
                {config.amenities.length > 0 && (
                    <div className="form-section">
                        <h4>Amenities</h4>
                        <div className="amenities-grid">
                            {config.amenities.map(amenity => {
                                const fieldDef = fieldDefinitions[amenity];
                                
                                if (fieldDef && fieldDef.type === 'select') {
                                    return (
                                        <div key={amenity} className="form-group">
                                            <label>{fieldDef.label}</label>
                                            <select
                                                name={`features.${amenity}`}
                                                value={propertyData.features[amenity] || ''}
                                                onChange={handleInputChange}
                                            >
                                                {fieldDef.options.map(option => (
                                                    <option key={option} value={option}>{option}</option>
                                                ))}
                                            </select>
                                        </div>
                                    );
                                }
                                
                                return (
                                    <label key={amenity} className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            name={`features.${amenity}`}
                                            checked={propertyData.features[amenity] || false}
                                            onChange={handleInputChange}
                                        />
                                        <span>{fieldDef?.label || formatFieldName(amenity)}</span>
                                    </label>
                                );
                            })}
                        </div>
                    </div>
                )}
            </>
        );
    };

    const renderField = (fieldName, fieldDef) => {
        const value = propertyData[fieldName] || '';
        
        switch (fieldDef.type) {
            case 'select':
                return (
                    <div key={fieldName} className="form-group">
                        <label>{fieldDef.label} {fieldDef.required && '*'}</label>
                        <select
                            name={fieldName}
                            value={value}
                            onChange={handleInputChange}
                            className={errors[fieldName] ? 'error' : ''}
                        >
                            <option value="">Select {fieldDef.label}</option>
                            {fieldDef.options.map(option => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                        {errors[fieldName] && <span className="error-message">{errors[fieldName]}</span>}
                    </div>
                );
                
            case 'checkbox':
                return (
                    <label key={fieldName} className="checkbox-label">
                        <input
                            type="checkbox"
                            name={fieldName}
                            checked={value || false}
                            onChange={handleInputChange}
                        />
                        <span>{fieldDef.label}</span>
                    </label>
                );
                
            case 'time':
                return (
                    <div key={fieldName} className="form-group">
                        <label>{fieldDef.label} {fieldDef.required && '*'}</label>
                        <input
                            type="time"
                            name={fieldName}
                            value={value}
                            onChange={handleInputChange}
                            className={errors[fieldName] ? 'error' : ''}
                        />
                        {errors[fieldName] && <span className="error-message">{errors[fieldName]}</span>}
                    </div>
                );
                
            default:
                return (
                    <div key={fieldName} className="form-group">
                        <label>{fieldDef.label} {fieldDef.required && '*'}</label>
                        <input
                            type={fieldDef.type || 'text'}
                            name={fieldName}
                            value={value}
                            onChange={handleInputChange}
                            placeholder={fieldDef.placeholder}
                            step={fieldDef.step}
                            className={errors[fieldName] ? 'error' : ''}
                        />
                        {errors[fieldName] && <span className="error-message">{errors[fieldName]}</span>}
                    </div>
                );
        }
    };

    const renderStandardField = (fieldName) => {
        // Render standard fields that aren't in fieldDefinitions
        const standardFields = {
            bedrooms: {
                label: 'Bedrooms',
                type: 'select',
                options: ['0', '1', '2', '3', '4', '5+']
            },
            bathrooms: {
                label: 'Bathrooms',
                type: 'select',
                options: ['1', '2', '3', '4+']
            },
            balconies: {
                label: 'Balconies',
                type: 'select',
                options: ['0', '1', '2', '3+']
            },
            floorNumber: {
                label: 'Floor Number',
                type: 'text',
                placeholder: 'e.g., 3 or Ground'
            },
            totalFloors: {
                label: 'Total Floors',
                type: 'number',
                placeholder: 'e.g., 12'
            },
            superArea: {
                label: 'Super Built-up Area (sq ft)',
                type: 'number',
                placeholder: 'e.g., 1200',
                required: true
            },
            builtUpArea: {
                label: 'Built-up Area (sq ft)',
                type: 'number',
                placeholder: 'e.g., 1100'
            },
            carpetArea: {
                label: 'Carpet Area (sq ft)',
                type: 'number',
                placeholder: 'e.g., 1000'
            }
        };

        const field = standardFields[fieldName];
        if (!field) return null;

        return renderField(fieldName, field);
    };

    const formatFieldName = (name) => {
        return name.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    };

    // Helper function to get the correct property type based on subcategory
    const getActualPropertyType = () => {
        let actualPropertyType = selectedPropertyType;
        
        // Special handling for Godown and Commercial Land - they should show commercial fields
        if (propertyData.subCategoryId) {
            const selectedSubcat = subcategories.find(sub => sub.id === parseInt(propertyData.subCategoryId));
            if (selectedSubcat) {
                if (selectedSubcat.name.toLowerCase().includes('godown') || 
                    selectedSubcat.name.toLowerCase().includes('commercial') ||
                    selectedSubcat.propertyType === 'commercial-land') {
                    actualPropertyType = 'commercial';
                }
            }
        }
        
        return actualPropertyType;
    };

    const handlePropertyForChange = async (value) => {
        setPropertyData(prev => ({
            ...prev,
            property_for: value,
            subCategoryId: '',
            propertyConfiguration: ''
        }));
        setSubcategories([]);
        
        // Refetch subcategories if category is already selected
        if (propertyData.categoryId) {
            await handleCategoryChange(propertyData.categoryId, value);
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
            const numericFields = ['bathrooms', 'balconies', 'totalFloors', 'superArea', 'builtUpArea', 
                                  'carpetArea', 'price', 'maintenanceCharge', 'plotArea', 'plotLength', 
                                  'plotBreadth', 'roadWidth', 'washrooms', 'totalArea', 'openArea', 
                                  'totalBeds', 'availableBeds', 'noticePeriod', 'frontage'];
            let finalValue = type === 'checkbox' ? checked : value;
            
            if (numericFields.includes(name) && value !== '') {
                finalValue = parseFloat(value) || 0;
            }
            
            // Handle property_for change to refetch subcategories
            if (name === 'property_for') {
                handlePropertyForChange(value);
                return;
            }
            
            // Handle subcategory change to update property type immediately
            if (name === 'subCategoryId' && value) {
                const selectedSubcat = subcategories.find(sub => sub.id === parseInt(value));
                if (selectedSubcat && selectedSubcat.propertyType) {
                    setSelectedPropertyType(selectedSubcat.propertyType);
                    resetFeaturesForPropertyType(selectedSubcat.propertyType);
                    
                    // Update property_for based on subcategory if it's commercial
                    if (selectedSubcat.name.toLowerCase().includes('godown') || 
                        selectedSubcat.name.toLowerCase().includes('commercial') ||
                        selectedSubcat.propertyType === 'commercial-land') {
                        setPropertyData(prev => ({
                            ...prev,
                            property_for: 'commercial'
                        }));
                    }
                }
            }
            
            setPropertyData({
                ...propertyData,
                [name]: finalValue
            });
        }
    };

    const handleBedroomsChange = (e) => {
        const bedrooms = e.target.value;
        let configuration = '';
        
        if (selectedPropertyType === 'studio') {
            configuration = 'Studio';
        } else if (selectedPropertyType === 'land' || selectedPropertyType === 'commercial-land') {
            configuration = '';
        } else if (selectedPropertyType === 'pg') {
            configuration = propertyData.sharingType + ' Sharing';
        } else {
            if (bedrooms === '0') {
                configuration = 'Studio';
            } else if (bedrooms === '5') {
                configuration = '5+ BHK';
            } else {
                configuration = `${bedrooms} BHK`;
            }
        }
        
        setPropertyData({
            ...propertyData,
            bedrooms: parseInt(bedrooms) || 0,
            propertyConfiguration: configuration
        });
    };

    const validateStep = () => {
        const newErrors = {};
        const actualPropertyType = getActualPropertyType();
        const config = propertyFormConfig[actualPropertyType];
        
        switch(step) {
            case 1:
                if (!propertyData.categoryId) newErrors.categoryId = 'Please select a category';
                if (!propertyData.property_for) newErrors.property_for = 'Please select property for';
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
                // Validate based on property type
                if (actualPropertyType === 'land' || actualPropertyType === 'commercial-land') {
                    if (!propertyData.plotArea || propertyData.plotArea <= 0) {
                        newErrors.plotArea = 'Plot area is required';
                    }
                } else if (actualPropertyType === 'farmhouse') {
                    if (!propertyData.totalArea || propertyData.totalArea <= 0) {
                        newErrors.totalArea = 'Total area is required';
                    }
                } else if (actualPropertyType === 'pg') {
                    if (!propertyData.totalBeds) newErrors.totalBeds = 'Total beds is required';
                    if (!propertyData.availableBeds) newErrors.availableBeds = 'Available beds is required';
                } else {
                    if (!propertyData.superArea || propertyData.superArea <= 0) {
                        newErrors.superArea = 'Super area is required';
                    }
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
        
        // Clean up the data before sending
        const cleanPropertyData = { ...propertyData };
        
        // Convert empty strings to null for numeric fields
        const numericFields = [
            'bedrooms', 'bathrooms', 'balconies', 'totalFloors', 'superArea', 'builtUpArea', 
            'carpetArea', 'price', 'maintenanceCharge', 'plotArea', 'plotLength', 
            'plotBreadth', 'roadWidth', 'washrooms', 'totalArea', 'openArea', 
            'totalBeds', 'availableBeds', 'noticePeriod', 'frontage', 'latitude', 'longitude'
        ];
        
        numericFields.forEach(field => {
            if (cleanPropertyData[field] === '' || cleanPropertyData[field] === undefined) {
                cleanPropertyData[field] = null;
            }
        });
        
        // Determine the correct property type for submission
        const actualPropertyType = getActualPropertyType();
        
        // Remove irrelevant fields based on property type
        const propertyPayload = {
            ...cleanPropertyData,
            propertyType: actualPropertyType,
            property_for: propertyData.property_for // Ensure property_for is included
        };
        
        
        // Clean up fields based on property type
        if (actualPropertyType === 'land' || actualPropertyType === 'commercial-land') {
            // For land, remove residential-specific fields
            delete propertyPayload.bedrooms;
            delete propertyPayload.bathrooms;
            delete propertyPayload.balconies;
            delete propertyPayload.superArea;
            delete propertyPayload.builtUpArea;
            delete propertyPayload.carpetArea;
            delete propertyPayload.floorNumber;
            delete propertyPayload.totalFloors;
            delete propertyPayload.furnishingStatus;
            delete propertyPayload.maintenanceCharge;
        } else if (actualPropertyType === 'pg') {
            // For PG, remove residential bedroom/bathroom fields
            delete propertyPayload.bedrooms;
            delete propertyPayload.bathrooms;
            delete propertyPayload.balconies;
            delete propertyPayload.superArea;
            delete propertyPayload.builtUpArea;
            delete propertyPayload.carpetArea;
        } else if (actualPropertyType === 'commercial') {
            // For commercial, remove residential-specific fields
            delete propertyPayload.bedrooms;
            delete propertyPayload.bathrooms;
            delete propertyPayload.balconies;
        }
        
        try {
            console.log('🚀 Submitting property with payload:', propertyPayload);
            
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
            console.log('📥 Property creation response:', data);
            
            // Check for authentication error
            if (response.status === 401) {
                alert('You need to login to create properties. Redirecting to login page...');
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/login');
                return;
            }
            
            if (!response.ok || !data.success) {
                console.error('Server response:', data);
                throw new Error(data.message || data.error || `Server error: ${response.status}`);
            }
            
            // Upload images if any
            if (images.length > 0) {
                console.log(`🖼️ Uploading ${images.length} images for property ${data.data.id}`);
                const formData = new FormData();
                images.forEach(image => {
                    formData.append('images', image);
                });
                
                const imageResponse = await fetch(`http://localhost:5000/api/properties/${data.data.id}/images`, {
                    method: 'POST',
                    headers: {
                        'x-auth-token': localStorage.getItem('token')
                    },
                    body: formData
                });
                
                const imageData = await imageResponse.json();
                console.log('📸 Image upload response:', imageData);
                
                if (!imageResponse.ok) {
                    console.error('❌ Image upload failed:', imageData);
                    // Don't fail the entire process if image upload fails
                }
            }
            
            alert('Property posted successfully!');
            navigate('/my-properties');
            
        } catch (error) {
            console.error('Error posting property:', error);
            console.error('Property payload that failed:', propertyPayload);
            
            // Provide more specific error messages
            let errorMessage = 'Failed to post property';
            if (error.message.includes('401')) {
                errorMessage = 'Authentication failed. Please login again.';
            } else if (error.message.includes('400')) {
                errorMessage = 'Invalid property data. Please check all required fields.';
            } else if (error.message.includes('500')) {
                errorMessage = 'Server error. Please try again later.';
            } else {
                errorMessage = error.message || 'Failed to post property';
            }
            
            alert(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        
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

    return (
        <div className="add-property-page" style={{ paddingTop: '120px' }}>
            <div className="add-property-container">
                <div className="property-header">
                    <h2>Post Your Property</h2>
                    <p>Fill in the details to list your property</p>
                    
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
                                    <label>Category *</label>
                                    <select
                                        name="categoryId"
                                        value={propertyData.categoryId}
                                        onChange={(e) => handleCategoryChange(e.target.value)}
                                        className={errors.categoryId ? 'error' : ''}
                                    >
                                        <option value="">Select Category</option>
                                        {getFilteredCategories().map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                    {errors.categoryId && <span className="error-message">{errors.categoryId}</span>}
                                </div>
                                
                                <div className="form-group">
                                    <label>Property For *</label>
                                    <select
                                        name="property_for"
                                        value={propertyData.property_for}
                                        onChange={handleInputChange}
                                        className={errors.property_for ? 'error' : ''}
                                    >
                                        <option value="residential">Residential</option>
                                        <option value="commercial">Commercial</option>
                                    </select>
                                    {errors.property_for && <span className="error-message">{errors.property_for}</span>}
                                </div>
                            </div>
                            
                            <div className="form-row">
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
                                        {subcategories.map(sub => (
                                            <option key={sub.id} value={sub.id}>{sub.name}</option>
                                        ))}
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

                    {/* Step 3: Property Details - Dynamic based on property type */}
                    {step === 3 && (
                        <div className="form-step">
                            <h3>Property Details</h3>
                            
                            {/* Show property type specific message */}
                            <div className="property-type-info">
                                <p>Filling details for: <strong>{propertyData.property_for.toUpperCase()}</strong> property</p>
                            </div>
                            
                            {/* Dynamic fields based on property type */}
                            {renderDynamicFields()}
                            
                            {/* Pricing Section - Common for all */}
                            <div className="form-section">
                                <h4>Pricing Details</h4>
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
                                    
                                    {getActualPropertyType() !== 'land' && getActualPropertyType() !== 'commercial-land' && (
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
                                    )}
                                </div>
                                
                                {/* For Rent/PG specific pricing */}
                                {(propertyData.categoryId === '2' || getActualPropertyType() === 'pg') && (
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Security Deposit (₹)</label>
                                            <input
                                                type="number"
                                                name="securityDeposit"
                                                value={propertyData.securityDeposit}
                                                onChange={handleInputChange}
                                                placeholder="e.g., 50000"
                                            />
                                        </div>
                                    </div>
                                )}
                                
                                <div className="form-group">
                                    <label className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            name="negotiable"
                                            checked={propertyData.negotiable}
                                            onChange={handleInputChange}
                                        />
                                        <span>Price Negotiable</span>
                                    </label>
                                </div>
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