// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { getProperties, getPropertyImageUrl } from '../api/property';
// import { getCurrentUser, getKYCDetails } from '../api/auth';
// import './Dashboard.css';

// const Dashboard = () => {
//   const [activeTab, setActiveTab] = useState('my-properties');
//   const [user, setUser] = useState(null);
//   const [properties, setProperties] = useState([]);
//   const [kycDocuments, setKycDocuments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [stats, setStats] = useState({
//     totalProperties: 0,
//     activeProperties: 0,
//     totalMessages: 0,
//     unreadMessages: 0
//   });

//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const currentUser = getCurrentUser();
//         setUser(currentUser);

//         if (currentUser) {
//           // Fetch user's properties using my-properties endpoint
//           const response = await fetch('http://localhost:5000/api/my-properties', {
//             method: 'GET',
//             headers: {
//               'Content-Type': 'application/json',
//               'Authorization': `Bearer ${localStorage.getItem('token')}`
//             }
//           });
//           const responseData = await response.json();
//           console.log('🔍 Full API Response:', responseData);
//           if (responseData.success) {
//             const userProperties = responseData.data.properties || [];
//             console.log('📊 User Properties:', userProperties);
//             console.log('🖼️ First Property Images:', userProperties[0]?.images);
//             console.log('🔍 First Property Full Object:', userProperties[0]);
//             setProperties(userProperties);
            
//             // Calculate stats
//             setStats({
//               totalProperties: userProperties.length,
//               activeProperties: userProperties.filter(p => p.status === 'active').length,
//               totalMessages: 0, // Will be implemented later
//               unreadMessages: 0 // Will be implemented later
//             });
//           }

//           // Fetch user's KYC documents
//           try {
//             const profileResponse = await fetch('http://localhost:5000/api/data/profile-status', {
//               method: 'GET',
//               headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${localStorage.getItem('token')}`
//               }
//             });
            
//             if (profileResponse.ok) {
//               const profileData = await profileResponse.json();
//               console.log('Profile Response:', profileData);
              
//               const documents = [];
//               let kycData = null;
              
//               if (profileData.user) {
//                 kycData = profileData.user;
//               } else if (profileData.data && profileData.data.user) {
//                 kycData = profileData.data.user;
//               }
              
//               console.log('KYC Data from profile:', kycData);
              
//               if (kycData) {
//                 if (kycData.aadharNumber) {
//                   documents.push({ 
//                     type: 'Aadhar Card', 
//                     file: kycData.aadharPhoto, 
//                     name: 'Aadhar Card', 
//                     number: kycData.aadharNumber 
//                   });
//                 }
                
//                 if (kycData.panNumber) {
//                   documents.push({ 
//                     type: 'PAN Card', 
//                     file: kycData.panPhoto, 
//                     name: 'PAN Card', 
//                     number: kycData.panNumber 
//                   });
//                 }
                
//                 if (kycData.bankStatement || kycData.bankStatementPath) {
//                   const bankFile = kycData.bankStatement || kycData.bankStatementPath;
//                   documents.push({ type: 'Bank Statement', file: bankFile, name: 'Bank Statement' });
//                 }
                
//                 if (kycData.incomeProof || kycData.incomeProofPath) {
//                   const incomeFile = kycData.incomeProof || kycData.incomeProofPath;
//                   documents.push({ type: 'Income Proof', file: incomeFile, name: 'Income Proof' });
//                 }
                
//                 if (kycData.addressProof || kycData.addressProofPath) {
//                   const addressFile = kycData.addressProof || kycData.addressProofPath;
//                   documents.push({ type: 'Address Proof', file: addressFile, name: 'Address Proof' });
//                 }
                
//                 if (kycData.photo || kycData.profileImage || kycData.photoPath) {
//                   const photoFile = kycData.photo || kycData.profileImage || kycData.photoPath;
//                   documents.push({ type: 'Photo', file: photoFile, name: 'Profile Photo' });
//                 }
                
//                 console.log('Final documents array:', documents);
//                 setKycDocuments(documents);
//               } else {
//                 console.log('No KYC data found in profile response');
//                 setKycDocuments([]);
//               }
//             } else {
//               console.log('Profile endpoint failed:', profileResponse.status);
//               setKycDocuments([]);
//             }
//           } catch (error) {
//             console.error('Error fetching KYC documents:', error);
//             setKycDocuments([]);
//           }
//         }
//       } catch (error) {
//         console.error('Error fetching user data:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUserData();
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//     window.location.href = '/login';
//   };

//   const renderMyProperties = () => (
//     <div className="dashboard-section">
//       <div className="section-header">
//         <h2>My Properties</h2>
//         <Link to="/add-property" className="btn btn-primary">
//           <i className="fas fa-plus"></i>
//           Add New Property
//         </Link>
//       </div>

//       {properties.length === 0 ? (
//         <div className="empty-state">
//           <i className="fas fa-home"></i>
//           <h3>No Properties Yet</h3>
//           <p>Start by adding your first property to get started.</p>
//           <Link to="/add-property" className="btn btn-primary">
//             <i className="fas fa-plus"></i>
//             Add Your First Property
//           </Link>
//         </div>
//       ) : (
//         <div className="properties-grid">
//           {properties.map((property) => (
//             <div key={property.id} className="property-card">
//               <div className="property-image">
//                 {property.images && property.images.length > 0 && property.images[0].imageUrl ? (
//                   <img 
//                     src={getPropertyImageUrl(property.images[0].imageUrl)} 
//                     alt={property.title}
//                     onError={(e) => {
//                       e.target.style.display = 'none';
//                       e.target.nextSibling.style.display = 'flex';
//                     }}
//                   />
//                 ) : null}
//                 <div className="no-image-placeholder" style={{ display: (property.images && property.images.length > 0 && property.images[0].imageUrl) ? 'none' : 'flex' }}>
//                   <i className="fas fa-image"></i>
//                   <span>No Image</span>
//                 </div>
//                 <div className={`property-status ${property.status}`}>
//                   {property.status?.toUpperCase() || 'ACTIVE'}
//                 </div>
//               </div>
//               <div className="property-content">
//                 <h3>{property.title || 'Untitled Property'}</h3>
//                 <p className="property-location">
//                   <i className="fas fa-map-marker-alt"></i>
//                   {property.address || 'Address not provided'}
//                 </p>
//                 <div className="property-details">
//                   <span className="price">₹{property.price?.toLocaleString() || '0'}</span>
//                   <span className="type">{property.propertyType || 'Property'}</span>
//                 </div>
//                 <div className="property-actions">
//                   <Link to={`/property/${property.slug}`} className="btn btn-outline btn-sm">
//                     <i className="fas fa-eye"></i>
//                     View
//                   </Link>
//                   <Link to={`/edit-property/${property.id}`} className="btn btn-outline btn-sm">
//                     <i className="fas fa-edit"></i>
//                     Edit
//                   </Link>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );

//   const renderMyMessages = () => (
//     <div className="dashboard-section">
//       <div className="section-header">
//         <h2>My Messages</h2>
//       </div>
//       <div className="empty-state">
//         <i className="fas fa-envelope"></i>
//         <h3>No Messages Yet</h3>
//         <p>Messages from potential buyers and tenants will appear here.</p>
//       </div>
//     </div>
//   );

//   const renderMyDocuments = () => (
//     <div className="dashboard-section">
//       <div className="section-header">
//         <h2>My Documents</h2>
//         <Link to="/complete-profile" className="btn btn-primary">
//           <i className="fas fa-upload"></i>
//           Update Documents
//         </Link>
//       </div>

//       {kycDocuments.length === 0 ? (
//         <div className="empty-state">
//           <i className="fas fa-file-alt"></i>
//           <h3>No KYC Documents Uploaded</h3>
//           <p>Complete your profile by uploading your KYC documents.</p>
//           <Link to="/complete-profile" className="btn btn-primary">
//             <i className="fas fa-upload"></i>
//             Upload KYC Documents
//           </Link>
//         </div>
//       ) : (
//         <div className="documents-grid">
//           {kycDocuments.map((doc, index) => (
//             <div key={index} className="document-card">
//               <div className="document-preview">
//                 {doc.file ? (
//                   <img 
//                     src={`http://localhost:5000${doc.file}`} 
//                     alt={doc.name}
//                     className="document-image"
//                     onError={(e) => {
//                       e.target.style.display = 'none';
//                       e.target.nextSibling.style.display = 'flex';
//                     }}
//                   />
//                 ) : null}
//                 <div className="document-icon" style={{ display: doc.file ? 'none' : 'flex' }}>
//                   <i className="fas fa-file"></i>
//                 </div>
//               </div>
//               <div className="document-content">
//                 <h4>{doc.name}</h4>
//                 <p className="document-type">{doc.type}</p>
//                 {doc.number && (
//                   <p className="document-number">{doc.number}</p>
//                 )}
//                 <div className="document-actions">
//                   {doc.file ? (
//                     <>
//                       <a 
//                         href={`http://localhost:5000${doc.file}`} 
//                         target="_blank" 
//                         rel="noopener noreferrer" 
//                         className="btn btn-outline btn-sm"
//                       >
//                         <i className="fas fa-eye"></i>
//                         View
//                       </a>
//                       <a 
//                         href={`http://localhost:5000${doc.file}`} 
//                         download 
//                         className="btn btn-outline btn-sm"
//                       >
//                         <i className="fas fa-download"></i>
//                         Download
//                       </a>
//                     </>
//                   ) : (
//                     <span className="no-file-text">No file uploaded</span>
//                   )}
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );

//   const renderContent = () => {
//     switch (activeTab) {
//       case 'my-properties':
//         return renderMyProperties();
//       case 'my-messages':
//         return renderMyMessages();
//       case 'my-documents':
//         return renderMyDocuments();
//       default:
//         return renderMyProperties();
//     }
//   };

//   if (loading) {
//     return (
//       <div className="dashboard-loading">
//         <div className="loading-spinner"></div>
//         <p>Loading your dashboard...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="dashboard-page">
//       {/* Full Height Sidebar */}
//       <div className="dashboard-sidebar">
//         <div className="sidebar-header">
//           <h2 className="sidebar-logo">
//             <i className="fas fa-home-lg-alt"></i>
//             PropertyHub
//           </h2>
//         </div>

//         <div className="user-info">
//           <div className="user-avatar">
//             {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
//           </div>
//           <h3 className="user-name">{user?.name || 'User'}</h3>
//           <p className="user-email">{user?.email || 'user@example.com'}</p>
//         </div>

//         <nav className="sidebar-menu">
//           <button 
//             className={`sidebar-item ${activeTab === 'my-properties' ? 'active' : ''}`}
//             onClick={() => setActiveTab('my-properties')}
//           >
//             <i className="fas fa-building"></i>
//             <span>My Properties</span>
//           </button>
//           <button 
//             className={`sidebar-item ${activeTab === 'my-messages' ? 'active' : ''}`}
//             onClick={() => setActiveTab('my-messages')}
//           >
//             <i className="fas fa-envelope"></i>
//             <span>Messages</span>
//             {stats.unreadMessages > 0 && (
//               <span className="unread-badge">{stats.unreadMessages}</span>
//             )}
//           </button>
//           <button 
//             className={`sidebar-item ${activeTab === 'my-documents' ? 'active' : ''}`}
//             onClick={() => setActiveTab('my-documents')}
//           >
//             <i className="fas fa-file-alt"></i>
//             <span>Documents</span>
//           </button>
//         </nav>

//         <div className="sidebar-footer">
//           <button className="logout-btn" onClick={handleLogout}>
//             <i className="fas fa-sign-out-alt"></i>
//             <span>Logout</span>
//           </button>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="dashboard-container">
//         {/* Header */}
//         <div className="dashboard-header">
//           <div className="welcome-section">
//             <h1>Welcome back, {user?.name || 'User'}!</h1>
//             <p>Manage your properties and documents from your dashboard</p>
//           </div>
//           <div className="dashboard-actions">
//           <Link to="/add-property" className="btn">
//               <i className="fas fa-plus"></i>
//               Add Property
//             </Link>
//           </div>
//         </div>

//         {/* Stats */}
//         <div className="stats-grid">
//           <div className="stat-card">
//             <div className="stat-icon">
//               <i className="fas fa-home"></i>
//             </div>
//             <div className="stat-content">
//               <h3>{stats.totalProperties}</h3>
//               <p>Total Properties</p>
//             </div>
//           </div>
//           <div className="stat-card">
//             <div className="stat-icon">
//               <i className="fas fa-check-circle"></i>
//             </div>
//             <div className="stat-content">
//               <h3>{stats.activeProperties}</h3>
//               <p>Active Properties</p>
//             </div>
//           </div>
//           <div className="stat-card">
//             <div className="stat-icon">
//               <i className="fas fa-envelope"></i>
//             </div>
//             <div className="stat-content">
//               <h3>{stats.totalMessages}</h3>
//               <p>Total Messages</p>
//             </div>
//           </div>
//           <div className="stat-card">
//             <div className="stat-icon">
//               <i className="fas fa-bell"></i>
//             </div>
//             <div className="stat-content">
//               <h3>{stats.unreadMessages}</h3>
//               <p>Unread Messages</p>
//             </div>
//           </div>
//         </div>

//         {/* Content Area */}
//         <div className="dashboard-content">
//           {renderContent()}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCurrentUser } from '../api/auth';
import PropertyCard from '../components/PropertyCard'; // Import the new component
import './Dashboard.css';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('my-properties');
  const [user, setUser] = useState(null);
  const [properties, setProperties] = useState([]);
  const [kycDocuments, setKycDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState({
    totalProperties: 0,
    activeProperties: 0,
    totalMessages: 0,
    unreadMessages: 0
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = getCurrentUser();
        setUser(currentUser);
        const token = localStorage.getItem('token');

        if (currentUser) {
          // Fetch user's properties
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
              activeProperties: userProperties.filter(p => p.status === 'active').length,
            }));
          }

          // Fetch user's KYC documents
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
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const renderMyProperties = () => (
    <div className="dashboard-section">
      <div className="section-header">
        <h2>My Properties</h2>
        <Link to="/add-property" className="btn btn-primary">
          <i className="fas fa-plus"></i> Add New Property
        </Link>
      </div>
      {properties.length === 0 ? (
        <div className="empty-state">
          <i className="fas fa-home"></i>
          <h3>No Properties Yet</h3>
          <p>Start by adding your first property to get started.</p>
          <Link to="/add-property" className="btn btn-primary">
            <i className="fas fa-plus"></i> Add Your First Property
          </Link>
        </div>
      ) : (
        <div className="properties-grid">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </div>
  );

  const renderMyMessages = () => (
    <div className="dashboard-section">
      <div className="section-header">
        <h2>My Messages</h2>
      </div>
      <div className="empty-state">
        <i className="fas fa-envelope"></i>
        <h3>No Messages Yet</h3>
        <p>Messages from potential buyers and tenants will appear here.</p>
      </div>
    </div>
  );

  const renderMyDocuments = () => (
    <div className="dashboard-section">
      <div className="section-header">
        <h2>MY DOCUMENTS</h2>
        <Link to="/complete-profile" className="btn btn-primary">
          <i className="fas fa-upload"></i> Update Documents
        </Link>
      </div>
      {kycDocuments.length === 0 ? (
        <div className="empty-state">
          <i className="fas fa-file-alt"></i>
          <h3>No KYC Documents Uploaded</h3>
          <p>Complete your profile by uploading your KYC documents.</p>
          <Link to="/complete-profile" className="btn btn-primary">
            <i className="fas fa-upload"></i> Upload KYC Documents
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

  const renderContent = () => {
    switch (activeTab) {
      case 'my-properties': return renderMyProperties();
      case 'my-messages': return renderMyMessages();
      case 'my-documents': return renderMyDocuments();
      default: return renderMyProperties();
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      {/* Hamburger Menu Toggle */}
      <button 
        className="hamburger-menu-toggle"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <i className="fas fa-bars"></i>
      </button>

      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div 
          className="sidebar-backdrop"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className={`dashboard-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2 className="sidebar-logo">
            <i className="fas fa-home-lg-alt"></i> 
            REAL EST
          </h2>
        </div>
        <div className="user-info">
          <div className="user-avatar">{user?.firstName ? user.firstName.charAt(0).toUpperCase() : 'U'}</div>
          <h3 className="user-name">{user?.firstName ? `${user.firstName} ${user.lastName}` : 'User'}</h3>
          <p className="user-email">{user?.email || 'user@example.com'}</p>
        </div>
        <nav className="sidebar-menu">
          <button className={`sidebar-item ${activeTab === 'my-properties' ? 'active' : ''}`} onClick={() => {setActiveTab('my-properties'); setSidebarOpen(false);}}>
            <i className="fas fa-building"></i> <span>My Properties</span>
          </button>
          <button className={`sidebar-item ${activeTab === 'my-messages' ? 'active' : ''}`} onClick={() => {setActiveTab('my-messages'); setSidebarOpen(false);}}>
            <i className="fas fa-envelope"></i> <span>Messages</span>
          </button>
          <button className={`sidebar-item ${activeTab === 'my-documents' ? 'active' : ''}`} onClick={() => {setActiveTab('my-documents'); setSidebarOpen(false);}}>
            <i className="fas fa-file-alt"></i> <span>Documents</span>
          </button>
        </nav>
        <div className="sidebar-footer">
          <button className="logout-btn btn btn-outline" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i> <span>Logout</span>
          </button>
        </div>
      </div>

      <div className="dashboard-container">
        <div className="dashboard-header">
          <div className="welcome-section">
            <h1>Welcome back, {user?.firstName ? `${user.firstName} ${user.lastName}` : 'User'}!</h1>
            <p>Here's your property and document overview.</p>
          </div>
          <div className="dashboard-actions">
            <Link to="/add-property" className="btn btn-primary">
              <i className="fas fa-plus"></i> Add Property
            </Link>
          </div>
        </div>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon"><i className="fas fa-home"></i></div>
            <div className="stat-content">
              <h3>{stats.totalProperties}</h3><p>Total Properties</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon"><i className="fas fa-check-circle"></i></div>
            <div className="stat-content">
              <h3>{stats.activeProperties}</h3><p>Active Properties</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon"><i className="fas fa-envelope"></i></div>
            <div className="stat-content">
              <h3>{stats.totalMessages}</h3><p>Total Messages</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon"><i className="fas fa-bell"></i></div>
            <div className="stat-content">
              <h3>{stats.unreadMessages}</h3><p>Unread Messages</p>
            </div>
          </div>
        </div>
        <div className="dashboard-content">{renderContent()}</div>
      </div>
    </div>
  );
};

export default Dashboard;