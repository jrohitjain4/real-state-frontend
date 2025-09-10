import React, { useState } from 'react';
import { authAPI } from '../api/auth';

const ProfileAvatar = ({ user, onLogout }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    authAPI.logout();
    onLogout();
    setIsDropdownOpen(false);
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarColor = (name) => {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
      '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <div className="profile-avatar-container" style={{ position: 'relative' }}>
      <div
        className="profile-avatar"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backgroundColor: getAvatarColor(user.name),
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          fontSize: '16px',
          fontWeight: 'bold',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          transition: 'all 0.3s ease',
          border: '2px solid white'
        }}
        onMouseOver={(e) => {
          e.target.style.transform = 'scale(1.05)';
          e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.25)';
        }}
        onMouseOut={(e) => {
          e.target.style.transform = 'scale(1)';
          e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
        }}
      >
        {getInitials(user.name)}
      </div>

      {isDropdownOpen && (
        <div
          className="profile-dropdown"
          style={{
            position: 'absolute',
            top: '50px',
            right: '0',
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            minWidth: '200px',
            zIndex: 1000,
            border: '1px solid #e0e0e0'
          }}
        >
          <div
            style={{
              padding: '16px',
              borderBottom: '1px solid #f0f0f0'
            }}
          >
            <div style={{ fontWeight: 'bold', color: '#333', marginBottom: '4px' }}>
              {user.name}
            </div>
            <div style={{ fontSize: '14px', color: '#666' }}>
              {user.email}
            </div>
            <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
              Role: {user.role}
            </div>
          </div>
          
          <div style={{ padding: '8px 0' }}>
            {user.role === 'admin' && (
              <a
                href="http://localhost:3001"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'block',
                  padding: '8px 16px',
                  color: '#333',
                  textDecoration: 'none',
                  fontSize: '14px',
                  transition: 'background-color 0.2s ease'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                Admin Dashboard
              </a>
            )}
            
            <button
              onClick={handleLogout}
              style={{
                width: '100%',
                padding: '8px 16px',
                border: 'none',
                backgroundColor: 'transparent',
                color: '#e74c3c',
                textAlign: 'left',
                cursor: 'pointer',
                fontSize: '14px',
                transition: 'background-color 0.2s ease'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#f5f5f5'}
              onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              Logout
            </button>
          </div>
        </div>
      )}

      {/* Overlay to close dropdown when clicking outside */}
      {isDropdownOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999
          }}
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </div>
  );
};

export default ProfileAvatar;
