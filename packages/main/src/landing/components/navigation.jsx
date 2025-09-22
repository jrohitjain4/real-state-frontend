import React, { useState, useEffect } from "react";
import "./navigation.css";
import { useAuth } from "../../contexts/AuthContext";
import LocationSelector from "./LocationSelector/LocationSelector";
import { categoriesAPI } from "../../api/categories";

export const Navigation = (props) => {
  const { user, isAuthenticated, handleAddPropertyClick } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await categoriesAPI.getAllCategories();
        if (response.success) {
          setCategories(response.data);
        } else {
          setError('Failed to load categories');
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to load categories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);


  // Helper function to render subcategory links
  const renderSubcategoryLinks = (subcategories, fallbackLinks = [], parentCategoryId = null) => {
    if (!subcategories || subcategories.length === 0) {
      // Show fallback links if no subcategories found
      if (fallbackLinks.length > 0) {
        return fallbackLinks.map((link, index) => (
          <a key={index} href={link.href}>
            {link.name}
          </a>
        ));
      }
      return <p style={{ color: '#999', fontSize: '12px' }}>No subcategories available</p>;
    }
    
    return subcategories.map(subcategory => {
      // Determine property_for based on subcategory propertyType and name
      let propertyFor = 'residential';
      if (subcategory.propertyType === 'commercial' || 
          subcategory.propertyType === 'commercial-land' ||
          subcategory.name.toLowerCase().includes('godown') ||
          subcategory.name.toLowerCase().includes('land')) {
        propertyFor = 'commercial';
      }
      
      // Get the category ID from the parent category, subcategory, or passed parameter
      const categoryId = subcategory.categoryId || (subcategory.category && subcategory.category.id) || parentCategoryId;
      
      return (
        <a 
          key={subcategory.id} 
          href={`/properties?category=${categoryId}&subcategory=${subcategory.id}&property_for=${propertyFor}`}
        >
          {subcategory.name}
        </a>
      );
    });
  };

  // Helper function to get specific subcategories by name pattern
  const getSubcategoriesByName = (subcategories, namePatterns) => {
    return subcategories.filter(sub => 
      namePatterns.some(pattern => 
        sub.name.toLowerCase().includes(pattern.toLowerCase())
      )
    );
  };

  // Get categories by slug for the new structure
  const buyCategory = categories.find(cat => cat.slug === 'buy');
  const buySubcategories = buyCategory ? buyCategory.subcategories || [] : [];

  const sellCategory = categories.find(cat => cat.slug === 'sell');
  const sellSubcategories = sellCategory ? sellCategory.subcategories || [] : [];

  const rentCategory = categories.find(cat => cat.slug === 'rent');
  const rentSubcategories = rentCategory ? rentCategory.subcategories || [] : [];
  
  const leaseCategory = categories.find(cat => cat.slug === 'lease');
  const leaseSubcategories = leaseCategory ? leaseCategory.subcategories || [] : [];

  return (
    <nav id="menu" className="navbar navbar-default navbar-fixed-top">
      <div className="container">
        <div className="navbar-header">
          {/* ... navbar toggle button ... */}
          <button
            type="button"
            className="navbar-toggle collapsed"
            data-toggle="collapse"
            data-target="#bs-example-navbar-collapse-1"
          >
            {" "}
            <span className="sr-only">Toggle navigation</span>{" "}
            <span className="icon-bar"></span> <span className="icon-bar"></span>{" "}
            <span className="icon-bar"></span>{" "}
          </button>
          
          <div className="navbar-brand-section">
            <a className="navbar-brand page-scroll" href="#page-top">
              RealEstate
            </a>
            
            <LocationSelector />
          </div>
        </div>

        <div
          className="collapse navbar-collapse"
          id="bs-example-navbar-collapse-1"
        >
          <ul className="nav navbar-nav navbar-right">
            
            {/* --- Buy Mega Menu (Dynamic) --- */}
            <li className="nav-item-dropdown">
              <a href={`/properties?category=${sellCategory?.id || ''}`} className="nav-link nav-link-dropdown">
                Buy
              </a>
              <div className="dropdown-menu dropdown-menu-mega">
                {loading ? (
                  <div className="dropdown-column">
                    <h4>Loading...</h4>
                    <p>Please wait while we load categories...</p>
                  </div>
                ) : error ? (
                  <div className="dropdown-column">
                    <h4>Error</h4>
                    <p>Failed to load categories. Please try again later.</p>
                  </div>
                ) : (
                  <>
                    <div className="dropdown-column">
                        <h4>Residential</h4>
                        {renderSubcategoryLinks(
                          sellSubcategories.filter(sub => 
                            ['residential', 'land', 'pg', 'farmhouse'].includes(sub.propertyType) && 
                            !sub.name.toLowerCase().includes('godown')
                          ),
                          [],
                          sellCategory?.id
                        )}
                    </div>
                    <div className="dropdown-column">
                        <h4>Commercial</h4>
                        {renderSubcategoryLinks(
                          sellSubcategories.filter(sub => 
                            ['commercial', 'commercial-land'].includes(sub.propertyType) ||
                            sub.name.toLowerCase().includes('godown') ||
                            sub.name.toLowerCase().includes('land')
                          ),
                          [],
                          sellCategory?.id
                        )}
                    </div>
                    <div className="dropdown-column">
                        <h4>Popular Choices</h4>
                        <a href={`/properties?category=${sellCategory?.id || ''}&status=ready-to-move`}>Ready to Move</a>
                        <a href={`/properties?category=${sellCategory?.id || ''}&owner=true`}>Owner Properties</a>
                        <a href={`/properties?category=${sellCategory?.id || ''}&verified=true`}>Verified Properties</a>
                        <a href={`/properties?category=${sellCategory?.id || ''}&new=true`}>New Projects</a>
                    </div>
                    <div className="dropdown-image-column">
                        <img src="https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Featured Property to Buy" />
                        <div className="image-caption">
                            <h4>Find Your Dream Home</h4>
                            <p>Explore exclusive properties.</p>
                        </div>
                    </div>
                  </>
                )}
              </div>
            </li>

            {/* --- Rent Mega Menu (Dynamic) --- */}
            <li className="nav-item-dropdown">
              <a href={`/properties?category=${rentCategory?.id || ''}`} className="nav-link nav-link-dropdown">
                Rent
              </a>
              <div className="dropdown-menu dropdown-menu-mega">
                {loading ? (
                  <div className="dropdown-column">
                    <h4>Loading...</h4>
                    <p>Please wait while we load categories...</p>
                  </div>
                ) : error ? (
                  <div className="dropdown-column">
                    <h4>Error</h4>
                    <p>Failed to load categories. Please try again later.</p>
                  </div>
                ) : (
                  <>
                    {/* Column 1 */}
                    <div className="dropdown-column">
                        <h4>Residential Rent</h4>
                        {renderSubcategoryLinks(
                          rentSubcategories.filter(sub => 
                            ['residential', 'land', 'pg', 'farmhouse'].includes(sub.propertyType) && 
                            !sub.name.toLowerCase().includes('godown')
                          ),
                          [],
                          rentCategory?.id
                        )}
                    </div>
                    {/* Column 2 */}
                    <div className="dropdown-column">
                        <h4>Commercial Rent</h4>
                        {renderSubcategoryLinks(
                          rentSubcategories.filter(sub => 
                            ['commercial', 'commercial-land'].includes(sub.propertyType) ||
                            sub.name.toLowerCase().includes('godown') ||
                            sub.name.toLowerCase().includes('land')
                          ),
                          [],
                          rentCategory?.id
                        )}
                    </div>
                    {/* Column 3 */}
                    <div className="dropdown-column">
                        <h4>Popular Searches</h4>
                        <a href={`/properties?category=${rentCategory?.id || ''}&furnishing=fully-furnished`}>Fully Furnished</a>
                        <a href={`/properties?category=${rentCategory?.id || ''}&furnishing=semi-furnished`}>Semi-Furnished</a>
                        <a href={`/properties?category=${rentCategory?.id || ''}&furnishing=unfurnished`}>Unfurnished</a>
                        <a href={`/properties?category=${rentCategory?.id || ''}&verified=true`}>Verified Properties</a>
                    </div>
                    {/* Column 4: Image */}
                    <div className="dropdown-image-column">
                        <img src="https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Featured Property to Rent" />
                        <div className="image-caption">
                            <h4>Easy & Secure Renting</h4>
                            <p>Find your next home with us.</p>
                        </div>
                    </div>
                  </>
                )}
              </div>
            </li>
            
            {/* --- Lease Properties --- */}
            <li className="nav-item-dropdown">
              <a href={`/properties?category=${leaseCategory?.id || ''}`} className="nav-link nav-link-dropdown">
                Lease
              </a>
              <div className="dropdown-menu dropdown-menu-mega">
                {loading ? (
                  <div className="dropdown-column">
                    <h4>Loading...</h4>
                    <p>Please wait while we load categories...</p>
                  </div>
                ) : error ? (
                  <div className="dropdown-column">
                    <h4>Error</h4>
                    <p>Failed to load categories. Please try again later.</p>
                  </div>
                ) : (
                  <>
                    {/* Column 1: Residential Lease */}
                    <div className="dropdown-column">
                      <h4>Residential Lease</h4>
                      {renderSubcategoryLinks(
                        leaseSubcategories.filter(sub => 
                          ['residential', 'land', 'pg', 'farmhouse'].includes(sub.propertyType) && 
                          !sub.name.toLowerCase().includes('godown')
                        ),
                        [],
                        leaseCategory?.id
                      )}
                    </div>
                    
                    {/* Column 2: Commercial Lease */}
                    <div className="dropdown-column">
                      <h4>Commercial Lease</h4>
                      {renderSubcategoryLinks(
                        leaseSubcategories.filter(sub => 
                          ['commercial', 'commercial-land'].includes(sub.propertyType) ||
                          sub.name.toLowerCase().includes('godown') ||
                          sub.name.toLowerCase().includes('land')
                        ),
                        [],
                        leaseCategory?.id
                      )}
                    </div>
                    
                    {/* Column 3: Popular Choices */}
                    <div className="dropdown-column">
                      <h4>Popular Choices</h4>
                      <a href={`/properties?category=${leaseCategory?.id || ''}&status=ready-to-move`}>Ready to Move</a>
                      <a href={`/properties?category=${leaseCategory?.id || ''}&owner=true`}>Owner Properties</a>
                      <a href={`/properties?category=${leaseCategory?.id || ''}&verified=true`}>Verified Properties</a>
                      <a href={`/properties?category=${leaseCategory?.id || ''}&new=true`}>New Projects</a>
                    </div>
                    
                    {/* Column 4: Image */}
                    <div className="dropdown-image-column">
                      <img src="https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Featured Property to Lease" />
                      <div className="image-caption">
                        <h4>Long-term Lease</h4>
                        <p>Find your perfect leased property.</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </li>
            
            <li>
              <a href="/properties" className="nav-link">
                All Properties
              </a>
            </li>
           
            <li>
              <a href="/add-property" onClick={handleAddPropertyClick} className="nav-post-property" style={{ cursor: 'pointer' }}>
                List <span className="free-tag">Free</span> Property
              </a>
            </li>
            
            <li className="auth-section">
              {isAuthenticated && user ? (
                 <a href="/profile" className="nav-link nav-user-profile">
                    Hi, {user.name || "mp jain"}
                 </a>
              ) : (
                <>
                  <a href="/login" className="nav-login-link">
                    Login
                  </a>
                  <a href="/register" className="nav-register-btn">
                    Get Started
                  </a>
                </>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};