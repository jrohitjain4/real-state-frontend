const { body, validationResult } = require('express-validator');

// Validation rules for user registration
const validateRegistration = [
    body('name')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Name must be between 2 and 50 characters')
        .matches(/^[a-zA-Z\s\-']+$/)
        .withMessage('Name can only contain letters, spaces, hyphens, and apostrophes'),
    
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email address')
        .isLength({ max: 100 })
        .withMessage('Email must be less than 100 characters'),
    
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
    
    body('role')
        .isIn(['user', 'admin'])
        .withMessage('Role must be either "user" or "admin"')
];

// Validation rules for user login
const validateLogin = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email address'),
    
    body('password')
        .notEmpty()
        .withMessage('Password is required')
];

// Validation rules for password reset
const validatePasswordReset = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email address')
];

// Validation rules for password change
const validatePasswordChange = [
    body('currentPassword')
        .notEmpty()
        .withMessage('Current password is required'),
    
    body('newPassword')
        .isLength({ min: 6 })
        .withMessage('New password must be at least 6 characters long')
];

// Validation rules for profile update
const validateProfileUpdate = [
    body('name')
        .optional()
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Name must be between 2 and 50 characters')
        .matches(/^[a-zA-Z\s\-']+$/)
        .withMessage('Name can only contain letters, spaces, hyphens, and apostrophes'),
    
    body('email')
        .optional()
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email address')
        .isLength({ max: 100 })
        .withMessage('Email must be less than 100 characters'),
    
    body('phone')
        .optional()
        .trim()
        .isLength({ max: 20 })
        .withMessage('Phone number must be less than 20 characters')
        .matches(/^[\d\s\-\+\(\)]+$/)
        .withMessage('Phone number can only contain digits, spaces, hyphens, plus signs, and parentheses')
];

// Validation rules for user update
const validateUserUpdate = [
    body('name')
        .optional()
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Name must be between 2 and 50 characters')
        .matches(/^[a-zA-Z\s\-']+$/)
        .withMessage('Name can only contain letters, spaces, hyphens, and apostrophes'),
    
    body('email')
        .optional()
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email address')
        .isLength({ max: 100 })
        .withMessage('Email must be less than 100 characters'),
    
    body('role')
        .optional()
        .isIn(['user', 'admin'])
        .withMessage('Role must be either "user" or "admin"')
];

// Middleware to check validation results
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array().map(error => ({
                field: error.path,
                message: error.msg,
                value: error.value
            }))
        });
    }
    next();
};

module.exports = {
    validateRegistration,
    validateLogin,
    validatePasswordReset,
    validatePasswordChange,
    validateProfileUpdate,
    validateUserUpdate,
    handleValidationErrors
};
