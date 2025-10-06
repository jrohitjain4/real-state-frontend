import React, { useState, useEffect } from 'react';
import { getCurrentUser } from '../api/auth';
import './Profile.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [profilePhotoFile, setProfilePhotoFile] = useState(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState(null);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    aadharNumber: '',
    panNumber: ''
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/data/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setUser(data.user);
        setFormData({
          firstName: data.user.firstName || '',
          lastName: data.user.lastName || '',
          email: data.user.email || '',
          phoneNumber: data.user.phoneNumber || '',
          address: data.user.address || '',
          city: data.user.city || '',
          state: data.user.state || '',
          pincode: data.user.pincode || '',
          aadharNumber: data.user.aadharNumber || '',
          panNumber: data.user.panNumber || ''
        });
        
        if (data.user.profilePhoto) {
          setProfilePhotoPreview(`http://localhost:5000${data.user.profilePhoto}`);
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      showMessage('error', 'Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showMessage('error', 'File size must be less than 5MB');
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        showMessage('error', 'Only image files are allowed');
        return;
      }
      
      setProfilePhotoFile(file);
      setProfilePhotoPreview(URL.createObjectURL(file));
    }
  };

  const uploadProfilePhoto = async () => {
    if (!profilePhotoFile) return;

    try {
      const token = localStorage.getItem('token');
      const photoFormData = new FormData();
      photoFormData.append('profilePhoto', profilePhotoFile);

      const response = await fetch('http://localhost:5000/api/data/profile/photo', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: photoFormData
      });

      const data = await response.json();
      
      if (data.success) {
        showMessage('success', 'Profile photo updated successfully');
        setProfilePhotoFile(null);
        
        // Update user data in localStorage
        const currentUser = getCurrentUser();
        if (currentUser) {
          currentUser.profilePhoto = data.photoPath;
          localStorage.setItem('user', JSON.stringify(currentUser));
        }
        
        return true;
      } else {
        showMessage('error', data.message || 'Failed to upload photo');
        return false;
      }
    } catch (error) {
      console.error('Error uploading photo:', error);
      showMessage('error', 'Failed to upload profile photo');
      return false;
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      // Upload photo first if there's a new one
      if (profilePhotoFile) {
        const photoUploaded = await uploadProfilePhoto();
        if (!photoUploaded) {
          setSaving(false);
          return;
        }
      }

      // Update profile data
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/data/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      if (data.success) {
        showMessage('success', 'Profile updated successfully!');
        setUser(data.user);
        setEditing(false);
        
        // Update localStorage
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Refresh profile data
        await fetchUserProfile();
      } else {
        showMessage('error', data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      showMessage('error', 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setProfilePhotoFile(null);
    
    // Reset form data to original user data
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        address: user.address || '',
        city: user.city || '',
        state: user.state || '',
        pincode: user.pincode || '',
        aadharNumber: user.aadharNumber || '',
        panNumber: user.panNumber || ''
      });
      
      if (user.profilePhoto) {
        setProfilePhotoPreview(`http://localhost:5000${user.profilePhoto}`);
      } else {
        setProfilePhotoPreview(null);
      }
    }
    
    setMessage({ type: '', text: '' });
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  const getRoleDisplay = (role) => {
    const roleMap = {
      'user': 'User',
      'agent': 'Agent',
      'admin': 'Admin',
      'owner': 'Owner'
    };
    return roleMap[role] || role;
  };

  const getRoleBadgeClass = (role) => {
    const roleClasses = {
      'user': 'role-badge-user',
      'agent': 'role-badge-agent',
      'admin': 'role-badge-admin',
      'owner': 'role-badge-owner'
    };
    return roleClasses[role] || 'role-badge-user';
  };

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="loading-spinner"></div>
        <p>Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <h1>My Profile</h1>
          {!editing ? (
            <button className="btn btn-primary" onClick={() => setEditing(true)}>
              <i className="fas fa-edit"></i> Edit Profile
            </button>
          ) : (
            <div className="action-buttons">
              <button 
                className="btn btn-success" 
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? (
                  <><i className="fas fa-spinner fa-spin"></i> Saving...</>
                ) : (
                  <><i className="fas fa-save"></i> Save</>
                )}
              </button>
              <button 
                className="btn btn-secondary" 
                onClick={handleCancel}
                disabled={saving}
              >
                <i className="fas fa-times"></i> Cancel
              </button>
            </div>
          )}
        </div>

        {message.text && (
          <div className={`alert alert-${message.type}`}>
            <i className={`fas fa-${message.type === 'success' ? 'check-circle' : 'exclamation-circle'}`}></i>
            {message.text}
          </div>
        )}

        <div className="profile-content">
          {/* Profile Photo Section */}
          <div className="profile-photo-section">
            <div className="photo-container">
              {profilePhotoPreview ? (
                <img src={profilePhotoPreview} alt="Profile" className="profile-photo" />
              ) : (
                <div className="profile-photo-placeholder">
                  <i className="fas fa-user"></i>
                </div>
              )}
              {editing && (
                <div className="photo-upload-overlay">
                  <label htmlFor="photo-upload" className="photo-upload-label">
                    <i className="fas fa-camera"></i>
                    <span>Change Photo</span>
                  </label>
                  <input
                    type="file"
                    id="photo-upload"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    style={{ display: 'none' }}
                  />
                </div>
              )}
            </div>
            {profilePhotoFile && (
              <p className="photo-hint">New photo selected. Click Save to upload.</p>
            )}
          </div>

          {/* Basic Information */}
          <div className="profile-section">
            <h2 className="section-title">
              <i className="fas fa-user-circle"></i> Basic Information
            </h2>
            <div className="form-grid">
              <div className="form-group">
                <label>First Name</label>
                {editing ? (
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                  />
                ) : (
                  <p className="form-value">{user?.firstName || 'Not provided'}</p>
                )}
              </div>

              <div className="form-group">
                <label>Last Name</label>
                {editing ? (
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                  />
                ) : (
                  <p className="form-value">{user?.lastName || 'Not provided'}</p>
                )}
              </div>

              <div className="form-group">
                <label>Email</label>
                {editing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                  />
                ) : (
                  <p className="form-value">{user?.email || 'Not provided'}</p>
                )}
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                {editing ? (
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="Enter phone number"
                  />
                ) : (
                  <p className="form-value">{user?.phoneNumber || 'Not provided'}</p>
                )}
              </div>

              <div className="form-group full-width">
                <label>Role</label>
                <div className="role-display">
                  <span className={`role-badge ${getRoleBadgeClass(user?.role)}`}>
                    {getRoleDisplay(user?.role)}
                  </span>
                  <span className="role-note">
                    <i className="fas fa-info-circle"></i> Role cannot be changed
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="profile-section">
            <h2 className="section-title">
              <i className="fas fa-map-marker-alt"></i> Address Information
            </h2>
            <div className="form-grid">
              <div className="form-group full-width">
                <label>Address</label>
                {editing ? (
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="form-control"
                    rows="3"
                    placeholder="Enter full address"
                  />
                ) : (
                  <p className="form-value">{user?.address || 'Not provided'}</p>
                )}
              </div>

              <div className="form-group">
                <label>City</label>
                {editing ? (
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="Enter city"
                  />
                ) : (
                  <p className="form-value">{user?.city || 'Not provided'}</p>
                )}
              </div>

              <div className="form-group">
                <label>State</label>
                {editing ? (
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="Enter state"
                  />
                ) : (
                  <p className="form-value">{user?.state || 'Not provided'}</p>
                )}
              </div>

              <div className="form-group">
                <label>Pincode</label>
                {editing ? (
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="Enter pincode"
                    maxLength="6"
                  />
                ) : (
                  <p className="form-value">{user?.pincode || 'Not provided'}</p>
                )}
              </div>
            </div>
          </div>

          {/* KYC Information */}
          <div className="profile-section">
            <h2 className="section-title">
              <i className="fas fa-id-card"></i> KYC Information
            </h2>
            <div className="form-grid">
              <div className="form-group">
                <label>Aadhar Number</label>
                {editing ? (
                  <input
                    type="text"
                    name="aadharNumber"
                    value={formData.aadharNumber}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="Enter 12-digit Aadhar number"
                    maxLength="12"
                  />
                ) : (
                  <p className="form-value">
                    {user?.aadharNumber ? `XXXX XXXX ${user.aadharNumber.slice(-4)}` : 'Not provided'}
                  </p>
                )}
              </div>

              <div className="form-group">
                <label>PAN Number</label>
                {editing ? (
                  <input
                    type="text"
                    name="panNumber"
                    value={formData.panNumber}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="Enter PAN number"
                    maxLength="10"
                    style={{ textTransform: 'uppercase' }}
                  />
                ) : (
                  <p className="form-value">
                    {user?.panNumber ? `${user.panNumber.slice(0, 2)}XXX${user.panNumber.slice(-4)}` : 'Not provided'}
                  </p>
                )}
              </div>

              <div className="form-group">
                <label>Aadhar Document</label>
                {user?.aadharPhoto ? (
                  <a 
                    href={`http://localhost:5000${user.aadharPhoto}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="document-link"
                  >
                    <i className="fas fa-file-image"></i> View Document
                  </a>
                ) : (
                  <p className="form-value">Not uploaded</p>
                )}
              </div>

              <div className="form-group">
                <label>PAN Document</label>
                {user?.panPhoto ? (
                  <a 
                    href={`http://localhost:5000${user.panPhoto}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="document-link"
                  >
                    <i className="fas fa-file-image"></i> View Document
                  </a>
                ) : (
                  <p className="form-value">Not uploaded</p>
                )}
              </div>

              <div className="form-group full-width">
                <div className="kyc-status">
                  <span className={`status-badge ${user?.kycVerified ? 'verified' : 'pending'}`}>
                    <i className={`fas fa-${user?.kycVerified ? 'check-circle' : 'clock'}`}></i>
                    {user?.kycVerified ? 'KYC Verified' : 'KYC Pending'}
                  </span>
                  {!user?.kycVerified && (
                    <p className="status-note">
                      Please complete your profile to verify your KYC
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Account Details */}
          <div className="profile-section">
            <h2 className="section-title">
              <i className="fas fa-cog"></i> Account Details
            </h2>
            <div className="form-grid">
              <div className="form-group">
                <label>Account Status</label>
                <p className="form-value">
                  <span className={`status-badge ${user?.isVerified ? 'verified' : 'pending'}`}>
                    <i className={`fas fa-${user?.isVerified ? 'check-circle' : 'clock'}`}></i>
                    {user?.isVerified ? 'Verified' : 'Not Verified'}
                  </span>
                </p>
              </div>

              <div className="form-group">
                <label>Profile Completion</label>
                <p className="form-value">
                  <span className={`status-badge ${user?.profileCompleted ? 'verified' : 'pending'}`}>
                    <i className={`fas fa-${user?.profileCompleted ? 'check-circle' : 'clock'}`}></i>
                    {user?.profileCompleted ? 'Complete' : 'Incomplete'}
                  </span>
                </p>
              </div>

              <div className="form-group">
                <label>Member Since</label>
                <p className="form-value">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : 'N/A'}
                </p>
              </div>

              <div className="form-group">
                <label>Last Login</label>
                <p className="form-value">
                  {user?.lastLogin ? new Date(user.lastLogin).toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  }) : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
