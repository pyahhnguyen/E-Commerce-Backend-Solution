'use strict'

// Export all middlewares from a central location
module.exports = {
    // Rate limiting middlewares
    ...require('./rateLimiter'),
    
    // CORS middleware
    ...require('./cors'),
    
    // Validation middlewares
    ...require('./validation'),
    
    // Upload middlewares
    ...require('./upload')
};
