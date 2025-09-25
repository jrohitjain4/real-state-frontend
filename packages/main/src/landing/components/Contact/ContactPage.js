// src/components/ContactPage.js

import React, { useState } from 'react';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import './ContactPage.css'; // CSS file import karna zaroori hai
import { FaMapMarkerAlt, FaEnvelope, FaRegClock, FaPhoneAlt } from 'react-icons/fa';

// --- !!! YAHAN APNI NAYI KEY DAALEIN !!! ---
// Is poori line ko aaram se check karein.
const googleMapsApiKey = 'AIzaSyCVkAmITruB7AD_F32fGFt24LhWm4mB3bY';
// ---------------------------------------------

const mapContainerStyle = {
    height: '100%',
    width: '100%'
};

const center = {
    lat: 40.9252,
    lng: -74.2385
};

const mapStyles = [
    { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
    { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
    { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
    { featureType: "road", elementType: "geometry", stylers: [{ color: "#38414e" }] },
    { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#212a37" }] },
    { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#9ca5b3" }] },
    { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#746855" }] },
    { featureType: "transit", elementType: "geometry", stylers: [{ color: "#2f3948" }] },
    { featureType: "water", elementType: "geometry", stylers: [{ color: "#17263c" }] },
];

const mapOptions = {
    styles: mapStyles,
    disableDefaultUI: true,
    zoomControl: true,
    fullscreenControl: true,
};

const ContactPage = () => {
    const { isLoaded, loadError } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: googleMapsApiKey,
    });

    const [formData, setFormData] = useState({ name: '', email: '', message: '' });

    const handleChange = (e) => {
        setFormData(prevState => ({ ...prevState, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert(`Form submitted!`);
        setFormData({ name: '', email: '', message: '' });
    };

    // Agar key galat hogi to yeh message dikhega
    if (loadError) {
        return <div>Error loading maps. Please check your API key and its settings in Google Cloud Console.</div>;
    }

    // Jab tak map load ho raha hai
    if (!isLoaded) {
        return <div>Loading Maps...</div>;
    }

    return (
        <div className="contact-section-wrapper">
            <div className="top-orange-bar"></div>
            <div className="contact-container">
                {/* Left Section - Map and Overlay */}
                <div className="map-section">
                    <GoogleMap 
                        mapContainerStyle={mapContainerStyle} 
                        center={center} 
                        zoom={14} 
                        options={mapOptions} 
                    />
                    <div className="contact-info-overlay">
                        <h3>CONTACT INFORMATION</h3>
                        <div className="info-item"><FaMapMarkerAlt className="icon" /><span>1477 Lava Ave Gazipur, NY 22512</span></div>
                        <div className="info-item"><FaEnvelope className="icon" /><div className="email-group"><span>help@landestate.com</span><span>anymail@landestate.com</span></div></div>
                        <div className="info-item"><FaRegClock className="icon" /><span>Monday-Sturday</span></div>
                        <div className="info-item"><FaPhoneAlt className="icon" /><span>(+88)01712570051</span></div>
                    </div>
                </div>

                {/* Right Section - Form */}
                <div className="form-section">
                    <h2>QUICK SEND US MESSAGE</h2>
                    <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusa nt ium</p>
                    <form className="contact-form" onSubmit={handleSubmit}>
                        <input type="text" name="name" placeholder="Your Name" value={formData.name} onChange={handleChange} required />
                        <input type="email" name="email" placeholder="Your Email" value={formData.email} onChange={handleChange} required />
                        <textarea name="message" placeholder="Your Message" value={formData.message} onChange={handleChange} rows="6" required></textarea>
                        <button type="submit" className="submit-btn">SEND MESSAGE</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;