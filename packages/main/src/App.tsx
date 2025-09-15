import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import './App.css';
import LandingPage from './pages/LandingPage';
import CompleteProfile from './pages/CompleteProfile';
import AddProperty from './pages/AddProperty';
import PropertyListing from './pages/PropertyListing';
import PropertyDetail from './pages/PropertyDetail';
import MyProperties from './pages/MyProperties';




function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
        <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/complete-profile" element={<CompleteProfile />} />
          <Route path="/properties" element={<PropertyListing />} />
        <Route path="/property/:slug" element={<PropertyDetail />} />
        <Route path="/add-property" element={<AddProperty />} />
        <Route path="/my-properties" element={<MyProperties />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;