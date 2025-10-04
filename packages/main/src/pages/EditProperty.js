import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../api/auth';
import './AddProperty.css'; // Reuse the same styles

const EditProperty = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [property, setProperty] = useState(null);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [images, setImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    bedrooms: '',
    bathrooms: '',
    area: '',
    categoryId: '',
    subCategoryId: '',
    propertyType: 'residential'
  });

  useEffect(() => {
    fetchPropertyData();
    fetchCategories();
  }, [id]);

  const fetchPropertyData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/properties/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          const prop = data.data;
          setProperty(prop);
          setFormData({
            title: prop.title || '',
            description: prop.description || '',
            price: prop.price || '',
            address: prop.address || '',
            city: prop.city || '',
            state: prop.state || '',
            pincode: prop.pincode || '',
            bedrooms: prop.bedrooms || '',
            bathrooms: prop.bathrooms || '',
            area: prop.superArea || prop.builtUpArea || prop.carpetArea || '',
            categoryId: prop.categoryId || '',
            subCategoryId: prop.subCategoryId || '',
            propertyType: prop.propertyType || 'residential'
          });
          setImages(prop.images || []);
          if (prop.categoryId) {
            fetchSubcategories(prop.categoryId);
          }
        } else {
          console.error('API Error:', data.message);
          setProperty(null);
          setError('Property not found or you do not have permission to edit it');
        }
      } else {
        const errorData = await response.json();
        console.error('HTTP Error:', response.status, errorData);
        setProperty(null);
        setError('Property not found or you do not have permission to edit it');
      }
    } catch (error) {
      console.error('Error fetching property:', error);
      setProperty(null);
      setError('Error loading property data');
    } finally {
      setLoading(false);
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

  const fetchSubcategories = async (categoryId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/categories/${categoryId}/subcategories`);
      const data = await response.json();
      if (data.success) {
        setSubcategories(data.data);
      }
    } catch (error) {
      console.error('Error fetching subcategories:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'categoryId') {
      fetchSubcategories(value);
      setFormData(prev => ({ ...prev, subCategoryId: '' }));
    }
  };

  // Image handling functions
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setNewImages(prev => [...prev, ...files]);
  };

  const handleDeleteProperty = async () => {
    if (window.confirm('Are you sure you want to delete this property? This action cannot be undone.')) {
      setDeleting(true);
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/properties/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            alert('Property deleted successfully!');
            navigate('/dashboard');
          } else {
            alert(data.message || 'Error deleting property');
          }
        } else {
          alert('Error deleting property');
        }
      } catch (error) {
        console.error('Error deleting property:', error);
        alert('Error deleting property');
      } finally {
        setDeleting(false);
      }
    }
  };

  const removeNewImage = (index) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
  };

  const uploadNewImages = async () => {
    if (newImages.length === 0) return;

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      
      newImages.forEach(file => {
        formData.append('images', file);
      });

      const response = await fetch(`http://localhost:5000/api/properties/${id}/images`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Refresh property data to get updated images
          await fetchPropertyData();
          setNewImages([]);
          alert('Images uploaded successfully!');
        } else {
          alert(data.message || 'Error uploading images');
        }
      } else {
        alert('Error uploading images');
      }
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Error uploading images');
    }
  };

  const removeImage = async (imageId) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/property-images/${imageId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          setImages(prev => prev.filter(img => img.id !== imageId));
          alert('Image deleted successfully!');
        } else {
          alert('Error deleting image');
        }
      } catch (error) {
        console.error('Error deleting image:', error);
        alert('Error deleting image');
      }
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // First upload new images if any
      if (newImages.length > 0) {
        await uploadNewImages();
      }

      // Then update property data
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/properties/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          alert('Property updated successfully!');
          navigate('/dashboard');
        } else {
          alert(data.message || 'Error updating property');
        }
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Error updating property');
      }
    } catch (error) {
      console.error('Error updating property:', error);
      alert('Error updating property');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="add-property-page">
        <div className="container">
          <div className="loading">
            <h2>Loading property data...</h2>
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="add-property-page">
        <div className="container">
          <div className="error">
            <h2>Property not found</h2>
            <button onClick={() => navigate('/dashboard')} className="btn btn-primary">
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="add-property-page">
      <div className="container">
        <div className="form-header">
          <h1>Edit Property</h1>
          <p>Update your property information</p>
        </div>

        <form onSubmit={handleSave} className="property-form">
          {/* Basic Information */}
          <div className="form-section">
            <h2>Basic Information</h2>
            <div className="form-row">
              <div className="form-group">
                <label>Property Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Price (₹) *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="4"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Category *</label>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Subcategory *</label>
                <select
                  name="subCategoryId"
                  value={formData.subCategoryId}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Subcategory</option>
                  {subcategories.map(sub => (
                    <option key={sub.id} value={sub.id}>{sub.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="form-section">
            <h2>Location</h2>
            <div className="form-group">
              <label>Address *</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>City *</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>State *</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Pincode</label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          {/* Property Details */}
          <div className="form-section">
            <h2>Property Details</h2>
            <div className="form-row">
              <div className="form-group">
                <label>Bedrooms</label>
                <input
                  type="number"
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleInputChange}
                  min="0"
                />
              </div>
              <div className="form-group">
                <label>Bathrooms</label>
                <input
                  type="number"
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleInputChange}
                  min="0"
                />
              </div>
              <div className="form-group">
                <label>Area (sqft)</label>
                <input
                  type="number"
                  name="area"
                  value={formData.area}
                  onChange={handleInputChange}
                  min="0"
                />
              </div>
            </div>
          </div>

          {/* Current Images */}
          <div className="form-section">
            <h2>Current Images</h2>
            <div className="images-grid">
              {images.map((image, index) => (
                <div key={image.id} className="image-item">
                  <img src={`http://localhost:5000${image.imageUrl}`} alt={`Property ${index + 1}`} />
                  <button
                    type="button"
                    className="delete-image-btn"
                    onClick={() => removeImage(image.id)}
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Add New Images */}
          <div className="form-section">
            <h2>Add New Images</h2>
            <div className="form-group">
              <label>Upload Images</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="file-input"
              />
            </div>
            
            {newImages.length > 0 && (
              <div className="new-images-preview">
                <h3>New Images Preview:</h3>
                <div className="images-grid">
                  {newImages.map((file, index) => (
                    <div key={index} className="image-item">
                      <img src={URL.createObjectURL(file)} alt={`New ${index + 1}`} />
                      <button
                        type="button"
                        className="delete-image-btn"
                        onClick={() => removeNewImage(index)}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="btn btn-outline"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDeleteProperty}
              className="btn btn-danger"
              disabled={deleting}
            >
              {deleting ? 'Deleting...' : 'Delete Property'}
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Update Property'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProperty;
