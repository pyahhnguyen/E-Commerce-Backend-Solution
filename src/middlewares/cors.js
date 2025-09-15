'use strict'

const cors = require('cors');

// CORS configuration
const corsOptions = {
    origin: function (origin, callback) {
       
        if (!origin) return callback(null, true);
        
        // List of allowed origins
        const allowedOrigins = [
            'http://localhost:3000',
            'http://localhost:3001', 
            'http://localhost:8080',
            'https://your-frontend-domain.com',
            'https://your-admin-panel.com'
        ];
        
        // Add environment-specific origins
        if (process.env.NODE_ENV === 'development') {
            allowedOrigins.push('http://localhost:3000', 'http://127.0.0.1:3000');
        }
        
        if (process.env.ALLOWED_ORIGINS) {
            const envOrigins = process.env.ALLOWED_ORIGINS.split(',');
            allowedOrigins.push(...envOrigins);
        }
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true, // Allow cookies to be sent
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
        'Origin',
        'X-Requested-With',
        'Content-Type',
        'Accept',
        'Authorization',
        'x-api-key',
        'x-client-id',
        'x-rtoken-id'
    ],
    exposedHeaders: ['x-api-key'],
    optionsSuccessStatus: 200, 
    maxAge: 86400 
};

// Development CORS (more permissive)
const devCorsOptions = {
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: '*',
    optionsSuccessStatus: 200
};

// Production CORS 
const prodCorsOptions = {
    ...corsOptions,
    origin: function (origin, callback) {
        // Stricter origin checking for production
        const allowedOrigins = process.env.ALLOWED_ORIGINS ? 
            process.env.ALLOWED_ORIGINS.split(',') : 
            ['https://your-production-domain.com'];
        
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
};

// Export appropriate CORS configuration based on environment
const getCorsConfig = () => {
    switch (process.env.NODE_ENV) {
        case 'production':
            return prodCorsOptions;
        case 'development':
            return devCorsOptions;
        default:
            return corsOptions;
    }
};

module.exports = {
    corsMiddleware: cors(getCorsConfig()),
    corsOptions,
    devCorsOptions,
    prodCorsOptions
};
