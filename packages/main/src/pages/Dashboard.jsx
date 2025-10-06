import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getCurrentUser } from '../api/auth';
import { getConversations, getMessages, sendMessage, markConversationAsRead } from '../api/message';
import PropertyCard from '../components/PropertyCard';
import socketService from '../services/socketService';
import avatarPlaceholder from '../assets/avatar-placeholder.png'; // Make sure you have this image
import './Dashboard.css';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('my-properties'); // Default to properties
  const [user, setUser] = useState(null);
  const [properties, setProperties] = useState([]);
  const [kycDocuments, setKycDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [conversationMessages, setConversationMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [stats, setStats] = useState({
    totalProperties: 0,
    activeProperties: 0,
    totalMessages: 0,
    unreadMessages: 0
  });
  
  // Profile states
  const [profileData, setProfileData] = useState(null);
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
    pincode: ''
  });
  
  const selectedConversationRef = useRef(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversationMessages]);

  const selectConversation = useCallback(async (conversation) => {
    // Prevent re-fetching if the same conversation is clicked
    if (selectedConversation?.conversationId === conversation.conversationId) return;

    setSelectedConversation(conversation);
    selectedConversationRef.current = conversation;
    await fetchConversationMessages(conversation.conversationId);
    try {
      await markConversationAsRead(conversation.conversationId);
      // Update unread count in UI immediately
      setConversations(prev => prev.map(c => 
        c.conversationId === conversation.conversationId ? { ...c, unreadCount: 0 } : c
      ));
    } catch (error) { console.error('Error marking conversation as read:', error); }
  }, [selectedConversation]);

  const fetchConversations = useCallback(async () => {
    try {
      const response = await getConversations();
      if (response.success) {
        setConversations(response.data);
        const totalMessages = response.data.reduce((sum, conv) => sum + (conv.messages?.length || 0), 0);
        const unreadMessages = response.data.reduce((sum, conv) => sum + (conv.unreadCount || 0), 0);
        setStats(prev => ({ ...prev, totalMessages, unreadMessages }));
        // Auto-select first conversation if none is selected
        if (!selectedConversationRef.current && response.data.length > 0) {
          selectConversation(response.data[0]);
        }
      }
    } catch (error) { console.error('Error fetching conversations:', error); }
  }, [selectConversation]);

  const fetchConversationMessages = async (conversationId) => {
    try {
      const response = await getMessages(1, 100, conversationId); // Fetch up to 100 messages
      if (response.success) {
        setConversationMessages(response.data.messages || []); // Use messages directly
      }
    } catch (error) { console.error('Error fetching conversation messages:', error); }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      const otherUser = selectedConversation.otherUser;
      const response = await sendMessage({ receiverId: otherUser.id, message: newMessage.trim() });
      if (response.success) {
        // Clear the input immediately
        setNewMessage('');
        // Let Socket.IO handle adding the message to avoid duplicates
        // The message will be added via the real-time listener
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = getCurrentUser();
        setUser(currentUser);
        const token = localStorage.getItem('token');
        if (currentUser) {
            const propertiesResponse = await fetch('http://localhost:5000/api/my-properties', { headers: { 'Authorization': `Bearer ${token}` } });
          const propertiesData = await propertiesResponse.json();
          if (propertiesData.success) {
            const userProperties = propertiesData.data.properties || [];
            setProperties(userProperties);
              setStats(prev => ({ ...prev, totalProperties: userProperties.length, activeProperties: userProperties.filter(p => p.status === 'active').length }));
          }

          // Fetch user's KYC documents
            try {
          const profileResponse = await fetch('http://localhost:5000/api/data/profile-status', {
            headers: { 'Authorization': `Bearer ${token}` }
          });

          if (profileResponse.ok) {
            const profileData = await profileResponse.json();
            const kycData = profileData.user || (profileData.data && profileData.data.user);
            if (kycData) {
              const documents = [];
              if (kycData.aadharNumber) documents.push({ type: 'Aadhar Card', file: kycData.aadharPhoto, name: 'Aadhar Card', number: kycData.aadharNumber });
              if (kycData.panNumber) documents.push({ type: 'PAN Card', file: kycData.panPhoto, name: 'PAN Card', number: kycData.panNumber });
              if (kycData.bankStatement || kycData.bankStatementPath) documents.push({ type: 'Bank Statement', file: kycData.bankStatement || kycData.bankStatementPath, name: 'Bank Statement' });
              if (kycData.incomeProof || kycData.incomeProofPath) documents.push({ type: 'Income Proof', file: kycData.incomeProof || kycData.incomeProofPath, name: 'Income Proof' });
              if (kycData.addressProof || kycData.addressProofPath) documents.push({ type: 'Address Proof', file: kycData.addressProof || kycData.addressProofPath, name: 'Address Proof' });
              if (kycData.photo || kycData.profileImage || kycData.photoPath) documents.push({ type: 'Photo', file: kycData.photo || kycData.profileImage || kycData.photoPath, name: 'Profile Photo' });
              setKycDocuments(documents);
            }
          }
            } catch (error) {
              console.error('Error fetching KYC documents:', error);
            }

            await fetchConversations();
            socketService.connect(currentUser.id);
            socketService.onMessageReceived((messageData) => {
            const currentConv = selectedConversationRef.current;
            
            if (currentConv) {
              // Add message if it's from the other user OR if it's your own message
              const isFromOtherUser = messageData.senderId === currentConv.otherUser.id;
              const isFromCurrentUser = messageData.senderId === currentUser.id;
              
              if (isFromOtherUser || isFromCurrentUser) {
                // Check if message already exists to avoid duplicates
                setConversationMessages(prev => {
                  const messageExists = prev.some(msg => 
                    msg.id === messageData.id || 
                    (msg.message === messageData.message && 
                     msg.senderId === messageData.senderId && 
                     Math.abs(new Date(msg.createdAt) - new Date(messageData.createdAt)) < 1000)
                  );
                  
                  if (messageExists) {
                    return prev; // Don't add duplicate
                  }
                  
                  return [...prev, messageData];
                });
              }
            }
            setTimeout(() => fetchConversations(), 200);
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
    return () => socketService.disconnect();
  }, [fetchConversations]);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  const handleDeleteProperty = async (propertyId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/properties/${propertyId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();
      
      if (data.success) {
        alert('Property deleted successfully!');
        // Refresh properties list
        const propertiesResponse = await fetch('http://localhost:5000/api/my-properties', { 
          headers: { 'Authorization': `Bearer ${token}` } 
        });
        const propertiesData = await propertiesResponse.json();
        if (propertiesData.success) {
          const userProperties = propertiesData.data.properties || [];
          setProperties(userProperties);
          setStats(prev => ({ 
            ...prev, 
            totalProperties: userProperties.length, 
            activeProperties: userProperties.filter(p => p.status === 'active').length 
          }));
        }
      } else {
        alert(data.message || 'Error deleting property');
      }
    } catch (error) {
      console.error('Error deleting property:', error);
      alert('Error deleting property');
    }
  };

  const renderMyProperties = () => (
    <div className="dashboard-section">
      <div className="section-header">
        <h2>My Properties</h2>
        <Link to="/add-property" className="btn btn-primary"><i className="fas fa-plus"></i> Add New Property</Link>
      </div>
      {properties.length === 0 ? (
        <div className="empty-state"><i className="fas fa-home"></i><h3>No Properties Yet</h3><p>Start by adding your first property to get started.</p><Link to="/add-property" className="btn btn-primary"><i className="fas fa-plus"></i> Add Your First Property</Link></div>
      ) : (
        <div className="properties-grid">{properties.map((property) => <PropertyCard key={property.id} property={property} onDelete={handleDeleteProperty} />)}</div>
      )}
    </div>
  );

  const renderMyDocuments = () => (
    <div className="dashboard-section">
      <div className="section-header">
        <h2>MY DOCUMENTS</h2>
        <Link to="/complete-profile" className="btn btn-primary"><i className="fas fa-upload"></i> Update Documents</Link>
      </div>
      
      {kycDocuments.length === 0 ? (
        <div className="empty-state">
          <i className="fas fa-file-alt"></i>
          <h3>No KYC Documents Uploaded</h3>
          <p>Complete your profile by uploading your KYC documents.</p>
          <Link to="/complete-profile" className="btn btn-primary">
            <i className="fas fa-upload"></i>
            Upload KYC Documents
          </Link>
        </div>
      ) : (
        <div className="documents-grid">
          {kycDocuments.map((doc, index) => (
            <div key={index} className="document-card">
              <div className="document-preview">
                {doc.file ? (
                  <img 
                    src={`http://localhost:5000${doc.file}`} 
                    alt={doc.name} 
                    className="document-image"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div className="document-icon" style={{ display: doc.file ? 'none' : 'flex' }}>
                  <i className="fas fa-file"></i>
                </div>
              </div>
              <div className="document-content">
                <h4>{doc.name}</h4>
                {doc.number && <p className="document-number">{doc.number}</p>}
                <div className="document-actions">
                  {doc.file ? (
                    <a 
                      href={`http://localhost:5000${doc.file}`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="btn btn-outline btn-sm"
                    >
                      <i className="fas fa-eye"></i> View
                    </a>
                  ) : (
                    <span className="no-file-text">No file uploaded</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // ✅ ONLY THIS FUNCTION'S CONTENT IS REPLACED
  const renderMyMessages = () => (
    <div className="dashboard-section chat-section">
      <div className="section-header my-massages"><h2>MY MESSAGES</h2></div>
      <div className="chat-section-container">
        <div className="conversations-panel">
          <div className="conversations-list">
            {conversations.length > 0 ? conversations.map((conv) => (
              <div key={conv.conversationId} className={`conversation-item ${selectedConversation?.conversationId === conv.conversationId ? 'active' : ''}`} onClick={() => selectConversation(conv)}>
                <div className="avatar"><img src={avatarPlaceholder} alt="avatar" /><div className="status-dot online"></div></div>
                <div className="conversation-details">
                  <h4>{conv.otherUser.firstName ? `${conv.otherUser.firstName} ${conv.otherUser.lastName}` : 'Unknown User'}</h4>
                  <p className="conversation-preview">{conv.lastMessage.message}</p>
                </div>
                <span className="conversation-time">{new Date(conv.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                {conv.unreadCount > 0 && <span className="unread-badge">{conv.unreadCount}</span>}
              </div>
            )) : <div className="empty-state-small">No conversations yet.</div>}
          </div>
        </div>
        <div className="chat-window">
          {selectedConversation ? (
            <>
              <div className="chat-header">
                <div className="chat-user-info"><div className="avatar"><img src={avatarPlaceholder} alt="avatar" /></div><div><h4>{selectedConversation.otherUser.firstName ? `${selectedConversation.otherUser.firstName} ${selectedConversation.otherUser.lastName}` : 'Unknown User'}</h4><p>Active</p></div></div>
                <div className="chat-header-actions"><button><i className="fas fa-search"></i></button><button><i className="fas fa-phone-alt"></i></button><button><i className="fas fa-info-circle"></i></button></div>
              </div>
              <div className="pinned-banner"><span><i className="fas fa-thumbtack"></i> 10 Pinned</span><button>+</button><button className="close-btn">&times;</button></div>
              <div className="chat-messages-area">
                {conversationMessages.map((msg) => {
                  const isSent = msg.senderId === user?.id;
                  return (
                    <div key={msg.id || msg.createdAt} className={`message-group ${isSent ? 'sent' : 'received'}`}>
                      {!isSent && (<div className="message-sender-info"><img src={avatarPlaceholder} alt="sender" className="message-avatar" /><span className="sender-name">{selectedConversation.otherUser.firstName}</span><span className="message-timestamp">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span></div>)}
                      <div className="message-bubble"><p>{msg.message}</p></div>
                      {isSent && (<div className="sent-message-meta"><i className="fas fa-check-double read-status"></i><span className="message-timestamp">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span><span>You</span><img src={avatarPlaceholder} alt="your avatar" className="message-avatar-self" /></div>)}
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
              <form className="chat-input-area" onSubmit={handleSendMessage}>
                <button type="button" className="icon-btn"><i className="far fa-smile"></i></button>
                <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Type your message..." className="chat-input" />
                <button type="submit" className="send-button" disabled={!newMessage.trim()}><i className="fas fa-paper-plane"></i></button>
              </form>
            </>
          ) : (<div className="no-conversation-selected"><h3>Select a conversation to start chatting</h3></div>)}
        </div>
      </div>
    </div>
  );

  // Profile related functions
  const fetchProfileData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/data/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setProfileData(data.user);
        setFormData({
          firstName: data.user.firstName || '',
          lastName: data.user.lastName || '',
          email: data.user.email || '',
          phoneNumber: data.user.phoneNumber || '',
          address: data.user.address || '',
          city: data.user.city || '',
          state: data.user.state || '',
          pincode: data.user.pincode || ''
        });
        if (data.user.profilePhoto) {
          setProfilePhotoPreview(`http://localhost:5000${data.user.profilePhoto}`);
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
    if (!profilePhotoFile) return true;
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

  const handleSaveProfile = async () => {
    setSaving(true);
    setMessage({ type: '', text: '' });
    try {
      if (profilePhotoFile) {
        const photoUploaded = await uploadProfilePhoto();
        if (!photoUploaded) {
          setSaving(false);
          return;
        }
      }
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
        setProfileData(data.user);
        setEditing(false);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        await fetchProfileData();
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

  const handleCancelEdit = () => {
    setEditing(false);
    setProfilePhotoFile(null);
    if (profileData) {
      setFormData({
        firstName: profileData.firstName || '',
        lastName: profileData.lastName || '',
        email: profileData.email || '',
        phoneNumber: profileData.phoneNumber || '',
        address: profileData.address || '',
        city: profileData.city || '',
        state: profileData.state || '',
        pincode: profileData.pincode || ''
      });
      if (profileData.profilePhoto) {
        setProfilePhotoPreview(`http://localhost:5000${profileData.profilePhoto}`);
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
    const roleMap = { 'user': 'User', 'agent': 'Agent', 'admin': 'Admin', 'owner': 'Owner' };
    return roleMap[role] || role;
  };

  const getRoleBadgeClass = (role) => {
    const roleClasses = { 'user': 'role-badge-user', 'agent': 'role-badge-agent', 'admin': 'role-badge-admin', 'owner': 'role-badge-owner' };
    return roleClasses[role] || 'role-badge-user';
  };

  const renderMyProfile = () => (
    <div className="dashboard-section profile-section-dashboard">
      <div className="section-header">
        <h2>MY PROFILE</h2>
        {!editing ? (
          <button className="btn btn-primary" onClick={() => setEditing(true)}>
            <i className="fas fa-edit"></i> Edit Profile
          </button>
        ) : (
          <div className="action-buttons">
            <button className="btn btn-success" onClick={handleSaveProfile} disabled={saving}>
              {saving ? <><i className="fas fa-spinner fa-spin"></i> Saving...</> : <><i className="fas fa-save"></i> Save</>}
            </button>
            <button className="btn btn-secondary" onClick={handleCancelEdit} disabled={saving}>
              <i className="fas fa-times"></i> Cancel
            </button>
          </div>
        )}
      </div>

      {message.text && (
        <div className={`profile-alert profile-alert-${message.type}`}>
          <i className={`fas fa-${message.type === 'success' ? 'check-circle' : 'exclamation-circle'}`}></i>
          {message.text}
        </div>
      )}

      <div className="profile-content-dashboard">
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
                <input type="file" id="photo-upload" accept="image/*" onChange={handlePhotoChange} style={{ display: 'none' }} />
              </div>
            )}
          </div>
          {profilePhotoFile && <p className="photo-hint">New photo selected. Click Save to upload.</p>}
        </div>

        <div className="profile-info-grid">
          <div className="profile-info-section">
            <h3><i className="fas fa-user-circle"></i> Basic Information</h3>
            <div className="form-grid-profile">
              <div className="form-group">
                <label>First Name</label>
                {editing ? (
                  <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} className="form-control" required />
                ) : (
                  <p className="form-value">{profileData?.firstName || 'Not provided'}</p>
                )}
              </div>
              <div className="form-group">
                <label>Last Name</label>
                {editing ? (
                  <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} className="form-control" required />
                ) : (
                  <p className="form-value">{profileData?.lastName || 'Not provided'}</p>
                )}
              </div>
              <div className="form-group">
                <label>Email</label>
                {editing ? (
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="form-control" required />
                ) : (
                  <p className="form-value">{profileData?.email || 'Not provided'}</p>
                )}
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                {editing ? (
                  <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} className="form-control" />
                ) : (
                  <p className="form-value">{profileData?.phoneNumber || 'Not provided'}</p>
                )}
              </div>
              <div className="form-group full-width">
                <label>Role</label>
                <div className="role-display">
                  <span className={`role-badge ${getRoleBadgeClass(profileData?.role)}`}>
                    {getRoleDisplay(profileData?.role)}
                  </span>
                  <span className="role-note">
                    <i className="fas fa-info-circle"></i> Role cannot be changed
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="profile-info-section">
            <h3><i className="fas fa-map-marker-alt"></i> Address Information</h3>
            <div className="form-grid-profile">
              <div className="form-group full-width">
                <label>Address</label>
                {editing ? (
                  <textarea name="address" value={formData.address} onChange={handleInputChange} className="form-control" rows="3" />
                ) : (
                  <p className="form-value">{profileData?.address || 'Not provided'}</p>
                )}
              </div>
              <div className="form-group">
                <label>City</label>
                {editing ? (
                  <input type="text" name="city" value={formData.city} onChange={handleInputChange} className="form-control" />
                ) : (
                  <p className="form-value">{profileData?.city || 'Not provided'}</p>
                )}
              </div>
              <div className="form-group">
                <label>State</label>
                {editing ? (
                  <input type="text" name="state" value={formData.state} onChange={handleInputChange} className="form-control" />
                ) : (
                  <p className="form-value">{profileData?.state || 'Not provided'}</p>
                )}
              </div>
              <div className="form-group">
                <label>Pincode</label>
                {editing ? (
                  <input type="text" name="pincode" value={formData.pincode} onChange={handleInputChange} className="form-control" maxLength="6" />
                ) : (
                  <p className="form-value">{profileData?.pincode || 'Not provided'}</p>
                )}
              </div>
            </div>
          </div>

          <div className="profile-info-section">
            <h3><i className="fas fa-id-card"></i> KYC Information</h3>
            <div className="form-grid-profile">
              <div className="form-group">
                <label>Aadhar Number</label>
                <p className="form-value">
                  {profileData?.aadharNumber ? `XXXX XXXX ${profileData.aadharNumber.slice(-4)}` : 'Not provided'}
                </p>
              </div>
              <div className="form-group">
                <label>PAN Number</label>
                <p className="form-value">
                  {profileData?.panNumber ? `${profileData.panNumber.slice(0, 2)}XXX${profileData.panNumber.slice(-4)}` : 'Not provided'}
                </p>
              </div>
              <div className="form-group">
                <label>KYC Status</label>
                <span className={`status-badge ${profileData?.kycVerified ? 'verified' : 'pending'}`}>
                  <i className={`fas fa-${profileData?.kycVerified ? 'check-circle' : 'clock'}`}></i>
                  {profileData?.kycVerified ? 'KYC Verified' : 'KYC Pending'}
                </span>
              </div>
              <div className="form-group">
                <label>Profile Status</label>
                <span className={`status-badge ${profileData?.profileCompleted ? 'verified' : 'pending'}`}>
                  <i className={`fas fa-${profileData?.profileCompleted ? 'check-circle' : 'clock'}`}></i>
                  {profileData?.profileCompleted ? 'Complete' : 'Incomplete'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'my-properties': return renderMyProperties();
      case 'my-messages': return renderMyMessages();
      case 'my-documents': return renderMyDocuments();
      case 'my-profile': return renderMyProfile();
      default: return renderMyProperties();
    }
  };

  if (loading) { return (<div className="dashboard-loading"><div className="loading-spinner"></div><p>Loading your dashboard...</p></div>); }

  return (
    <div className="dashboard-page">
      <button className="hamburger-menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}><i className="fas fa-bars"></i></button>
      {sidebarOpen && (<div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)} />)}
      <div className={`dashboard-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header"><h2 className="sidebar-logo"><i className="fas fa-home-lg-alt"></i> REAL EST</h2></div>
        <div className="user-info"><div className="user-avatar">{user?.firstName ? user.firstName.charAt(0).toUpperCase() : 'U'}</div><h3 className="user-name">{user?.firstName ? `${user.firstName} ${user.lastName}` : 'User'}</h3><p className="user-email">{user?.email || 'user@example.com'}</p></div>
        <nav className="sidebar-menu">
          <button className={`sidebar-item ${activeTab === 'my-properties' ? 'active' : ''}`} onClick={() => {setActiveTab('my-properties'); setSidebarOpen(false);}}><i className="fas fa-building"></i> <span>My Properties</span></button>
          <button className={`sidebar-item ${activeTab === 'my-messages' ? 'active' : ''}`} onClick={() => {setActiveTab('my-messages'); setSidebarOpen(false);}}><i className="fas fa-envelope"></i> <span>Messages</span></button>
          <button className={`sidebar-item ${activeTab === 'my-documents' ? 'active' : ''}`} onClick={() => {setActiveTab('my-documents'); setSidebarOpen(false);}}><i className="fas fa-file-alt"></i> <span>Documents</span></button>
          <button className={`sidebar-item ${activeTab === 'my-profile' ? 'active' : ''}`} onClick={() => {setActiveTab('my-profile'); setSidebarOpen(false); fetchProfileData();}}><i className="fas fa-user-circle"></i> <span>My Profile</span></button>
        </nav>
        <div className="sidebar-footer"><button className="logout-btn btn btn-outline" onClick={handleLogout}><i className="fas fa-sign-out-alt"></i> <span>Logout</span></button></div>
      </div>
      <div className="dashboard-container">
        <div className="dashboard-header"><div className="welcome-section"><h1>Welcome back, {user?.firstName ? `${user.firstName} ${user.lastName}` : 'User'}!</h1><p>Here's your property and document overview.</p></div><div className="dashboard-actions"><Link to="/add-property" className="btn btn-primary"><i className="fas fa-plus"></i> Add Property</Link></div></div>
        <div className="stats-grid"><div className="stat-card"><div className="stat-icon"><i className="fas fa-home"></i></div><div className="stat-content"><h3>{stats.totalProperties}</h3><p>Total Properties</p></div></div><div className="stat-card"><div className="stat-icon"><i className="fas fa-check-circle"></i></div><div className="stat-content"><h3>{stats.activeProperties}</h3><p>Active Properties</p></div></div><div className="stat-card"><div className="stat-icon"><i className="fas fa-envelope"></i></div><div className="stat-content"><h3>{stats.totalMessages}</h3><p>Total Messages</p></div></div><div className="stat-card"><div className="stat-icon"><i className="fas fa-bell"></i></div><div className="stat-content"><h3>{stats.unreadMessages}</h3><p>Unread Messages</p></div></div></div>
        <div className="dashboard-content">{renderContent()}</div>
      </div>
    </div>
  );
};

export default Dashboard;