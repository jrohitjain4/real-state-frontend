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
    const [currentUser, setCurrentUser] = useState(null);
    
    // Dynamic property data state based on property type
    const [propertyData, setPropertyData] = useState({
        // Basic Info
        categoryId: '',
        subCategoryId: '',
        propertyConfiguration: '',
        property_for: 'residential',
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
        features: {}
    });

    const [images, setImages] = useState([]);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Please login to add a property');
            navigate('/login');
            return;
        }
        
        fetchCurrentUser();
        fetchCategories();
        checkProfileCompletion();
    }, [navigate]);

    useEffect(() => {
        if (propertyData.subCategoryId && subcategories.length > 0) {
            const selectedSubcat = subcategories.find(sub => sub.id === parseInt(propertyData.subCategoryId));
            if (selectedSubcat && selectedSubcat.propertyType) {
                setSelectedPropertyType(selectedSubcat.propertyType);
                resetFeaturesForPropertyType(selectedSubcat.propertyType);
                
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

    const fetchCurrentUser = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/data/profile-status', {
                headers: {
                    'x-auth-token': localStorage.getItem('token')
                }
            });
            
            const data = await response.json();
            if (data.success) {
                setCurrentUser(data.user);
            }
        } catch (error) {
            console.error('Error fetching user:', error);
        }
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
                    const filteredSubcategories = data.data.filter(sub => {
                        if (currentPropertyFor === 'residential') {
                            return !sub.name.toLowerCase().includes('godown') && 
                                   sub.propertyType !== 'commercial' &&
                                   sub.propertyType !== 'commercial-land';
                        } else if (currentPropertyFor === 'commercial') {
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

    const getActualPropertyType = () => {
        let actualPropertyType = selectedPropertyType;
        
        if (propertyData.subCategoryId) {
            const selectedSubcat = subcategories.find(sub => sub.id === parseInt(propertyData.subCategoryId));
            if (selectedSubcat) {
                const subcatName = selectedSubcat.name.toLowerCase();
                
                if (subcatName.includes('godown') || 
                    subcatName.includes('commercial') ||
                    selectedSubcat.propertyType === 'commercial-land') {
                    actualPropertyType = 'commercial';
                }
                else if (subcatName.includes('house')) {
                    actualPropertyType = 'house';
                }
                else if (subcatName.includes('villa')) {
                    actualPropertyType = 'villa';
                }
                else if (subcatName.includes('farmhouse')) {
                    actualPropertyType = 'farmhouse';
                }
                else if (subcatName.includes('studio')) {
                    actualPropertyType = 'studio';
                }
                else if (subcatName.includes('pg') || subcatName.includes('coliving')) {
                    actualPropertyType = 'pg';
                }
                else if (subcatName.includes('plot') || subcatName.includes('land')) {
                    actualPropertyType = 'land';
                }
                else if (subcatName.includes('flat')) {
                    actualPropertyType = 'residential';
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

if (name === 'property_for') {
handlePropertyForChange(value);
return;
}

if (name === 'subCategoryId' && value) {
const selectedSubcat = subcategories.find(sub => sub.id === parseInt(value));
if (selectedSubcat && selectedSubcat.propertyType) {
  setSelectedPropertyType(selectedSubcat.propertyType);
  resetFeaturesForPropertyType(selectedSubcat.propertyType);
  
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

const validateStep = () => {
const newErrors = {};
const actualPropertyType = getActualPropertyType();

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
if (!propertyData.ownershipType) {
  newErrors.ownershipType = 'Please select your relationship to this property';
}
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

const cleanPropertyData = { ...propertyData };

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

const actualPropertyType = getActualPropertyType();

const propertyPayload = {
...cleanPropertyData,
propertyType: actualPropertyType,
property_for: propertyData.property_for
};

if (actualPropertyType === 'land' || actualPropertyType === 'commercial-land') {
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
delete propertyPayload.bedrooms;
delete propertyPayload.bathrooms;
delete propertyPayload.balconies;
delete propertyPayload.superArea;
delete propertyPayload.builtUpArea;
delete propertyPayload.carpetArea;
} else if (actualPropertyType === 'commercial') {
delete propertyPayload.bedrooms;
delete propertyPayload.bathrooms;
delete propertyPayload.balconies;
}

try {
const response = await fetch('http://localhost:5000/api/properties', {
method: 'POST',
headers: {
  'Content-Type': 'application/json',
  'x-auth-token': localStorage.getItem('token')
},
body: JSON.stringify(propertyPayload)
});

const data = await response.json();

if (response.status === 401) {
alert('You need to login to create properties. Redirecting to login page...');
localStorage.removeItem('token');
localStorage.removeItem('user');
navigate('/login');
return;
}

if (!response.ok || !data.success) {
throw new Error(data.message || data.error || `Server error: ${response.status}`);
}

if (images.length > 0) {
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

if (!imageResponse.ok) {
  console.error('Image upload failed');
}
}

alert('Property posted successfully!');
navigate('/my-properties');

} catch (error) {
console.error('Error posting property:', error);

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
<div className="add-property-page">
<div className="add-property-container">
{/* LEFT SIDE - FORM */}
<div className="property-form-wrapper">
  <div className="property-header">
      <h2>Post Your <span>Property</span></h2>
      <p>Fill in the details to list your property</p>
      
      <div className="progress-steps">
          <div className={`step ${step >= 1 ? 'active' : ''}`}>
              <div className="step-number">1</div>
              <span>Basic Info</span>
          </div>
          <div className={`step ${step >= 2 ? 'active' : ''}`}>
              <div className="step-number">2</div>
              <span>Location</span>
          </div>
          <div className={`step ${step >= 3 ? 'active' : ''}`}>
              <div className="step-number">3</div>
              <span>Details</span>
          </div>
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

      {/* Step 3: Property Details */}
      {step === 3 && (
          <div className="form-step">
              <h3>Property Details</h3>
              
              <div className="property-type-info">
                  <p>Filling details for: <strong>{propertyData.property_for.toUpperCase()}</strong> property</p>
              </div>
              
              {renderDynamicFields()}
              
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
      
      {/* Step 4: Images & Ownership */}
      {step === 4 && (
          <div className="form-step">
              <h3>Property Images & Ownership</h3>
              
              <div className="form-section">
                  <h4>Ownership Details</h4>
                  <div className="form-group">
                      <label>I am posting this property as *</label>
                      <select
                          name="ownershipType"
                          value={propertyData.ownershipType}
                          onChange={handleInputChange}
                          className={errors.ownershipType ? 'error' : ''}
                      >
                          <option value="">Select your role for this property</option>
                          <option value="owner">Property Owner</option>
                          <option value="dealer">Property Dealer</option>
                          <option value="builder">Builder/Developer</option>
                          <option value="agent">Real Estate Agent</option>
                      </select>
                      {errors.ownershipType && <span className="error-message">{errors.ownershipType}</span>}
                      <small>
                          {currentUser && currentUser.role === 'agent' 
                              ? "As an agent, you can post properties as owner, dealer, builder, or agent"
                              : "Select your relationship to this property"
                          }
                      </small>
                  </div>
              </div>
              
              <div className="form-section">
                  <h4>Property Images</h4>
                  <p className="step-description">📸 Add stunning photos of your property (Max 10 images, 5MB each)</p>
                  
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

              {/* RIGHT SIDE - ILLUSTRATION (STICKY) */}
<div className="property-illustration">
    <div className="illustration-card">
        {/* Hero Section with Background Image */}
        <div className="illustration-hero">
            <img 
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80" 
                alt="Beautiful House"
            />
            <div className="illustration-hero-content">
                <div className="hero-icon">
                    <i className="fas fa-home"></i>
                </div>
                <h3>List Your Dream Property</h3>
                <p>Join thousands of property owners who trust us</p>
            </div>
        </div>
        
        {/* Content Section */}
        <div className="illustration-content">
            {/* Property Showcase Images */}
            <div className="property-showcase">
                <div className="showcase-item">
                    <img 
                        src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&q=80" 
                        alt="Modern Home"
                    />
                    <div className="showcase-overlay">Modern Homes</div>
                </div>
                <div className="showcase-item">
                    <img 
                        src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&q=80" 
                        alt="Luxury Villa"
                    />
                    <div className="showcase-overlay">Luxury Villas</div>
                </div>
                <div className="showcase-item">
                    <img 
                        src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&q=80" 
                        alt="Apartments"
                    />
                    <div className="showcase-overlay">Apartments</div>
                </div>
                <div className="showcase-item">
                    <img 
                        src="https://images.unsplash.com/photo-1448630360428-65456885c650?w=400&q=80" 
                        alt="Commercial"
                    />
                    <div className="showcase-overlay">Commercial</div>
                </div>
            </div>
            
            {/* Features */}
            <div className="illustration-features">
                <div className="feature-item">
                    <div className="feature-icon">✓</div>
                    <div className="feature-text">
                        <strong>Free Listing</strong>
                        <span>No charges to post your property</span>
                    </div>
                </div>
                <div className="feature-item">
                    <div className="feature-icon">👥</div>
                    <div className="feature-text">
                        <strong>Reach Millions</strong>
                        <span>Get noticed by verified buyers</span>
                    </div>
                </div>
                <div className="feature-item">
                    <div className="feature-icon">⚡</div>
                    <div className="feature-text">
                        <strong>Quick Approval</strong>
                        <span>Go live within 24 hours</span>
                    </div>
                </div>
            </div>
            
            {/* Stats */}
            <div className="property-stats">
                <div className="stat-item">
                    <span className="stat-number">5000+</span>
                    <span className="stat-label">Properties</span>
                </div>
                <div className="stat-item">
                    <span className="stat-number">2000+</span>
                    <span className="stat-label">Happy Owners</span>
                </div>
                <div className="stat-item">
                    <span className="stat-number">98%</span>
                    <span className="stat-label">Success Rate</span>
                </div>
            </div>
        </div>
    </div>
</div>
            </div>
        </div>
    );
};

export default AddProperty;