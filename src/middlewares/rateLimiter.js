'use strict'

const rateLimit = require('express-rate-limit');
const { TooManyRequestsError } = require('../core/error.response');

// General rate limiter
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: {
        status: 'error',
        code: 429,
        message: 'Too many requests from this IP, please try again after 15 minutes.'
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    handler: (req, res, next) => {
        throw new TooManyRequestsError('Too many requests from this IP, please try again later.');
    }
});

// Strict rate limiter for authentication endpoints
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per windowMs for auth endpoints
    message: {
        status: 'error',
        code: 429,
        message: 'Too many authentication attempts, please try again after 15 minutes.'
    },
    skipSuccessfulRequests: true, // Don't count successful requests
    handler: (req, res, next) => {
        throw new TooManyRequestsError('Too many authentication attempts, please try again later.');
    }
});

// Product creation rate limiter
const createProductLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // limit each IP to 10 product creations per hour
    message: {
        status: 'error',
        code: 429,
        message: 'Too many products created, please try again after 1 hour.'
    },
    handler: (req, res, next) => {
        throw new TooManyRequestsError('Too many products created, please try again later.');
    }
});

// Order creation rate limiter
const orderLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 3, // limit each IP to 3 orders per minute
    message: {
        status: 'error',
        code: 429,
        message: 'Too many orders created, please wait a moment.'
    },
    handler: (req, res, next) => {
        throw new TooManyRequestsError('Too many orders created, please wait a moment.');
    }
});

module.exports = {
    generalLimiter,
    authLimiter,
    createProductLimiter,
    orderLimiter
};
