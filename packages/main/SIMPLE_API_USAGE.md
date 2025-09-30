# Simple API Usage

## How to Use

### 1. Import Services
```javascript
import { 
  authService, 
  propertyService, 
  categoryService 
} from './services';
```

### 2. Authentication
```javascript
// Login
const result = await authService.login(email, password);

// Register
const result = await authService.register(userData);

// Check profile
const profile = await authService.checkProfileCompletion();

// Upload KYC
const kyc = await authService.uploadKYCDocuments(kycData);
```

### 3. Properties
```javascript
// Get all properties
const properties = await propertyService.getProperties();

// Get properties with filters
const properties = await propertyService.getProperties({
  city: 'Mumbai',
  categoryId: 1,
  subCategoryId: 2,
  minPrice: 1000000,
  maxPrice: 5000000
});

// Get property by slug
const property = await propertyService.getPropertyBySlug('luxury-apartment-mumbai');

// Create property
const newProperty = await propertyService.createProperty(propertyData);

// Upload images
const images = await propertyService.uploadPropertyImages(propertyId, imageFiles);
```

### 4. Categories
```javascript
// Get all categories
const categories = await categoryService.getAllCategories();

// Get subcategories
const subcategories = await categoryService.getSubcategoriesByCategory(categoryId);

// Get categories for navigation
const navCategories = await categoryService.getCategoriesForNavigation();
```

## API Endpoints

All endpoints are defined in `src/config/api.js`:

```javascript
const API_CONFIG = {
  BASE_URL: 'http://localhost:5000/api',
  ENDPOINTS: {
    // Auth
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    UPLOAD_KYC: '/auth/upload-kyc',
    
    // User
    PROFILE_STATUS: '/data/profile-status',
    KYC_DETAILS: '/data/kyc-details',
    
    // Properties
    PROPERTIES: '/properties',
    PROPERTY_BY_SLUG: '/properties/:slug',
    CREATE_PROPERTY: '/properties',
    
    // Categories
    CATEGORIES: '/categories',
    SUBCATEGORIES: '/categories/:id/subcategories'
  }
};
```

## That's It!

Simple, clean, and easy to use! 🚀
