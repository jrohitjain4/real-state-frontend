// src/pages/CompleteProfile.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CompleteProfile.css';

const CompleteProfile = () => {
    const [isProfileCompleted, setIsProfileCompleted] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [step, setStep] = useState(1);
    const [profileData, setProfileData] = useState({
        phone: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        aadharNumber: '',
        panNumber: ''
    });
    
    const [documents, setDocuments] = useState({
        profilePhoto: null,
        aadharPhoto: null,
        panPhoto: null
    });
    
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [completionStatus, setCompletionStatus] = useState(0);
    
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        checkProfileStatus();
    }, []);

    const checkProfileStatus = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/data/profile-status', {
                headers: {
                    'x-auth-token': token
                }
            });
            
            const data = await response.json();
            if (data.success) {
                // Check if profile is already completed
                if (data.user.profileCompleted) {
                    console.log('Profile is already completed');
                    setIsProfileCompleted(true);
                }
                
                setCompletionStatus(data.completionPercentage);
                
                // Pre-fill existing data
                if (data.user) {
                    setProfileData({
                        phone: data.user.phone || '',
                        address: data.user.address || '',
                        city: data.user.city || '',
                        state: data.user.state || '',
                        pincode: data.user.pincode || '',
                        aadharNumber: data.user.aadharNumber || '',
                        panNumber: data.user.panNumber || ''
                    });
                }
            }
        } catch (error) {
            console.error('Error fetching profile status:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        // Special handling for PAN number
        let finalValue = value;
        if (name === 'panNumber') {
            finalValue = value.toUpperCase();
        }
        
        setProfileData({ ...profileData, [name]: finalValue });
        
        // Clear error for this field
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const handleFileChange = (e, docType) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                setErrors({ ...errors, [docType]: 'File size must be less than 5MB' });
                return;
            }
            setDocuments({ ...documents, [docType]: file });
        }
    };

    const validateStep = () => {
        const newErrors = {};
        
        if (step === 1) {
            if (!profileData.phone || !/^\d{10}$/.test(profileData.phone)) {
                newErrors.phone = 'Please enter a valid 10-digit phone number';
            }
        } else if (step === 2) {
            if (!profileData.address) newErrors.address = 'Address is required';
            if (!profileData.city) newErrors.city = 'City is required';
            if (!profileData.state) newErrors.state = 'State is required';
            if (!profileData.pincode || !/^\d{6}$/.test(profileData.pincode)) {
                newErrors.pincode = 'Please enter a valid 6-digit pincode';
            }
        } else if (step === 3) {
            if (!profileData.aadharNumber || !/^\d{12}$/.test(profileData.aadharNumber)) {
                newErrors.aadharNumber = 'Please enter a valid 12-digit Aadhar number';
            }
            if (!profileData.panNumber || !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(profileData.panNumber)) {
                newErrors.panNumber = 'Please enter a valid PAN number';
            }
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = async () => {
        if (!validateStep()) {
            return;
        }
        
        if (step < 3) {
            setStep(step + 1);
        } else {
            await handleSubmit();
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        
        try {
            // Update KYC details
            const detailsResponse = await fetch('http://localhost:5000/api/data/kyc-details', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify(profileData)
            });
            
            const detailsData = await detailsResponse.json();
            
            if (!detailsData.success) {
                throw new Error(detailsData.message);
            }
            
            // Upload documents
            for (const [docType, file] of Object.entries(documents)) {
                if (file) {
                    const formData = new FormData();
                    formData.append('document', file);
                    formData.append('documentType', docType.replace('Photo', ''));
                    
                    await fetch('http://localhost:5000/api/auth/upload-kyc', {
                        method: 'POST',
                        headers: {
                            'x-auth-token': token
                        },
                        body: formData
                    });
                }
            }
            
            alert('Profile completed successfully!');
            navigate('/');
            
        } catch (error) {
            console.error('Error updating profile:', error);
            alert(error.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handleSkip = () => {
        navigate('/');
    };

    // Loading screen
    if (isLoading) {
        return (
            <div className="loading-container">
                <div className="loader"></div>
                <p>Loading profile status...</p>
            </div>
        );
    }

    // Profile already completed screen
    if (isProfileCompleted) {
        return (
            <div className="complete-profile-page">
                <div className="profile-completed-container">
                    <div className="success-icon">✓</div>
                    <h2>Profile Already Completed!</h2>
                    <p>Your profile is already complete. You can now post properties.</p>
                    
                    <div className="profile-summary">
                        <h3>Your Profile Details:</h3>
                        <div className="detail-row">
                            <span className="label">Phone:</span>
                            <span className="value">{profileData.phone}</span>
                        </div>
                        <div className="detail-row">
                            <span className="label">Address:</span>
                            <span className="value">{profileData.address}</span>
                        </div>
                        <div className="detail-row">
                            <span className="label">City, State:</span>
                            <span className="value">{profileData.city}, {profileData.state} - {profileData.pincode}</span>
                        </div>
                        <div className="detail-row">
                            <span className="label">Aadhar:</span>
                            <span className="value">XXXX-XXXX-{profileData.aadharNumber.slice(-4)}</span>
                        </div>
                        <div className="detail-row">
                            <span className="label">PAN:</span>
                            <span className="value">{profileData.panNumber}</span>
                        </div>
                    </div>
                    
                    <div className="action-buttons">
                        <button 
                            className="primary-button" 
                            onClick={() => navigate('/')}
                        >
                            Go to Home
                        </button>
                        <button 
                            className="secondary-button" 
                            onClick={() => navigate('/profile')}
                        >
                            View Full Profile
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Normal form render
    return (
        <div className="complete-profile-page">
            <div className="complete-profile-container">
                <div className="profile-header">
                    <h2>Complete Your Profile</h2>
                    <p>Complete your profile to unlock all features</p>
                    
                    {/* Progress Steps */}
                    <div className="progress-steps">
                        <div className={`step ${step >= 1 ? 'active' : ''}`}>
                            <div className="step-number">1</div>
                            <span>Contact</span>
                        </div>
                        <div className={`step-line ${step >= 2 ? 'active' : ''}`}></div>
                        <div className={`step ${step >= 2 ? 'active' : ''}`}>
                            <div className="step-number">2</div>
                            <span>Address</span>
                        </div>
                        <div className={`step-line ${step >= 3 ? 'active' : ''}`}></div>
                        <div className={`step ${step >= 3 ? 'active' : ''}`}>
                            <div className="step-number">3</div>
                            <span>KYC</span>
                        </div>
                    </div>
                </div>

                <form className="profile-form" onSubmit={(e) => e.preventDefault()}>
                    {/* Step 1: Contact Information */}
                    {step === 1 && (
                        <div className="form-step">
                            <h3>Contact Information</h3>
                            <div className="form-group">
                                <label>Phone Number *</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={profileData.phone}
                                    onChange={handleInputChange}
                                    placeholder="9876543210"
                                    className={errors.phone ? 'error' : ''}
                                />
                                {errors.phone && <span className="error-message">{errors.phone}</span>}
                            </div>
                            
                            <div className="form-group">
                                <label>Profile Photo</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleFileChange(e, 'profilePhoto')}
                                />
                                <p className="help-text">Upload a clear photo of yourself</p>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Address Details */}
                    {step === 2 && (
                        <div className="form-step">
                            <h3>Address Details</h3>
                            <div className="form-group">
                                <label>Full Address *</label>
                                <textarea
                                    name="address"
                                    value={profileData.address}
                                    onChange={handleInputChange}
                                    placeholder="Enter your complete address"
                                    rows="3"
                                    className={errors.address ? 'error' : ''}
                                />
                                {errors.address && <span className="error-message">{errors.address}</span>}
                            </div>
                            
                            <div className="form-row">
                                <div className="form-group">
                                    <label>City *</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={profileData.city}
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
                                        value={profileData.state}
                                        onChange={handleInputChange}
                                        placeholder="Maharashtra"
                                        className={errors.state ? 'error' : ''}
                                    />
                                    {errors.state && <span className="error-message">{errors.state}</span>}
                                </div>
                            </div>
                            
                            <div className="form-group">
                                <label>Pincode *</label>
                                <input
                                    type="text"
                                    name="pincode"
                                    value={profileData.pincode}
                                    onChange={handleInputChange}
                                    placeholder="400001"
                                    maxLength="6"
                                    className={errors.pincode ? 'error' : ''}
                                />
                                {errors.pincode && <span className="error-message">{errors.pincode}</span>}
                            </div>
                        </div>
                    )}

                    {/* Step 3: KYC Information */}
                    {step === 3 && (
                        <div className="form-step">
                            <h3>KYC Information</h3>
                            <div className="form-group">
                                <label>Aadhar Number *</label>
                                <input
                                    type="text"
                                    name="aadharNumber"
                                    value={profileData.aadharNumber}
                                    onChange={handleInputChange}
                                    placeholder="1234 5678 9012"
                                    maxLength="12"
                                    className={errors.aadharNumber ? 'error' : ''}
                                />
                                {errors.aadharNumber && <span className="error-message">{errors.aadharNumber}</span>}
                            </div>
                            
                            <div className="form-group">
                                <label>Aadhar Card Photo</label>
                                <input
                                    type="file"
                                    accept="image/*,.pdf"
                                    onChange={(e) => handleFileChange(e, 'aadharPhoto')}
                                />
                                <p className="help-text">Upload clear photo/scan of your Aadhar card</p>
                            </div>
                            
                            <div className="form-group">
                                <label>PAN Number *</label>
                                <input
                                    type="text"
                                    name="panNumber"
                                    value={profileData.panNumber}
                                    onChange={handleInputChange}
                                    placeholder="ABCDE1234F"
                                    maxLength="10"
                                    className={errors.panNumber ? 'error' : ''}
                                    style={{ textTransform: 'uppercase' }}
                                />
                                {errors.panNumber && <span className="error-message">{errors.panNumber}</span>}
                            </div>
                            
                            <div className="form-group">
                                <label>PAN Card Photo</label>
                                <input
                                    type="file"
                                    accept="image/*,.pdf"
                                    onChange={(e) => handleFileChange(e, 'panPhoto')}
                                />
                                <p className="help-text">Upload clear photo/scan of your PAN card</p>
                            </div>
                        </div>
                    )}

                    {/* Form Actions */}
                    <div className="form-actions">
                        <button 
                            type="button" 
                            className="skip-button" 
                            onClick={handleSkip}
                        >
                            Skip for now
                        </button>
                        
                        <div className="primary-actions">
                            {step > 1 && (
                                <button 
                                    type="button" 
                                    className="back-button"
                                    onClick={() => setStep(step - 1)}
                                >
                                    Back
                                </button>

)}
                            
<button 
    type="button" 
    className="next-button"
    onClick={handleNext}
    disabled={loading}
>
    {loading ? 'Processing...' : (step === 3 ? 'Complete Profile' : 'Next')}
</button>
</div>
</div>
</form>
</div>
</div>
);
};

export default CompleteProfile;