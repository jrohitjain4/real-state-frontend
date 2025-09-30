/**
 * API Index - Export all API functions
 */

// Auth API
export * from './auth';

// Property API
export * from './property';

// Category API
export * from './category';

// Upload API
export * from './upload';

// Legacy APIs (for backward compatibility)
export { authAPI } from './auth';
export { propertyAPI } from './property';
export { categoryAPI } from './category';
export { uploadAPI } from './upload';
export { categoriesAPI } from './categories';
export { propertyCategoriesAPI } from './propertyCategories';
