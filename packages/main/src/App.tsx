// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import LoginPage from './pages/LoginPage';
// import RegisterPage from './pages/RegisterPage';
// import './App.css';
// import LandingPage from './pages/LandingPage';
// import CompleteProfile from './pages/CompleteProfile';
// import AddProperty from './pages/AddProperty';
// import PropertyListing from './pages/PropertyListing.js';
// import PropertyDetail from './pages/PropertyDetail';
// import MyProperties from './pages/MyProperties';




// function App() {
//   return (
//     <Router>
//       <div className="App">
//         <Routes>
//         <Route path="/" element={<LandingPage />} />
//           <Route path="/login" element={<LoginPage />} />
//           <Route path="/register" element={<RegisterPage />} />
//           <Route path="/complete-profile" element={<CompleteProfile />} />
//           <Route path="/properties" element={<PropertyListing />} />
//         <Route path="/property/:slug" element={<PropertyDetail />} />
//         <Route path="/add-property" element={<AddProperty />} />
//         <Route path="/my-properties" element={<MyProperties />} />
//         </Routes>
//       </div>
//     </Router>
//   );
// }

// export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import './App.css';
import LandingPage from './pages/LandingPage';
import CompleteProfile from './pages/CompleteProfile';
import AddProperty from './pages/AddProperty';
import EditProperty from './pages/EditProperty';
import PropertyListing from './pages/PropertyListing';
import PropertyDetail from './pages/PropertyDetail';
import MyProperties from './pages/MyProperties';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import NotFoundPage from './pages/NotFoundPage';
import { Navigation } from './landing/components/navigation';
import { LocationProvider } from './contexts/LocationContext';
import { AuthProvider } from './contexts/AuthContext';




// Component to conditionally show navigation
const AppContent = () => {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';

  return (
    <AuthProvider>
      <LocationProvider>
        <div className="App">
          {/* Show navigation on all pages except landing page (it has its own) */}
          {!isLandingPage && <Navigation />}
          
          <Routes>
          <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/complete-profile" element={<CompleteProfile />} />
            <Route path="/properties" element={<PropertyListing />} />
          <Route path="/property/:slug" element={<PropertyDetail />} />
          <Route path="/property-by-id/:id" element={<PropertyDetail />} />
          <Route path="/add-property" element={<AddProperty />} />
          <Route path="/edit-property/:id" element={<EditProperty />} />
          <Route path="/my-properties" element={<MyProperties />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </LocationProvider>
    </AuthProvider>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;