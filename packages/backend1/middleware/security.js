const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors');

// Rate limiting middleware
const createRateLimiter = (windowMs, max, message) => {
    return rateLimit({
        windowMs,
        max,
        message: {
            error: message,
            retryAfter: Math.ceil(windowMs / 1000)
        },
        standardHeaders: true,
        legacyHeaders: false,
    });
};

// General API rate limiter
const apiLimiter = createRateLimiter(
    parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
    'Too many requests from this IP, please try again later.'
);

// Stricter rate limiter for auth routes
const authLimiter = createRateLimiter(
    15 * 60 * 1000, // 15 minutes
    5, // 5 requests per 15 minutes
    'Too many authentication attempts, please try again later.'
);

// CORS configuration
const corsOptions = {
    origin: function (origin, callback) {
        const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'];
        
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    optionsSuccessStatus: 200
};

// Security middleware setup
const setupSecurity = (app) => {
    // Basic security headers
    app.use(helmet());
    
    // CORS
    app.use(cors(corsOptions));
    
    // Rate limiting
    app.use('/api/', apiLimiter);
    app.use('/api/auth/', authLimiter);
    
    // Additional security headers
    app.use((req, res, next) => {
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('X-Frame-Options', 'DENY');
        res.setHeader('X-XSS-Protection', '1; mode=block');
        res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
        next();
    });
};

module.exports = {
    setupSecurity,
    apiLimiter,
    authLimiter
};