'use strict'

const { body, param, query, validationResult } = require('express-validator');
const { BadRequestError } = require('../core/error.response');

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => ({
            field: error.path,
            message: error.msg,
            value: error.value
        }));
        
        throw new BadRequestError('Validation failed', errorMessages);
    }
    next();
};

// Common validation rules
const commonValidations = {
    mongoId: param('id').isMongoId().withMessage('Invalid ID format'),
    
    email: body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    
    password: body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
    
    name: body('name')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Name must be between 2 and 50 characters'),
    
    price: body('product_price')
        .isFloat({ min: 0 })
        .withMessage('Price must be a positive number'),
    
    quantity: body('product_quantity')
        .isInt({ min: 0 })
        .withMessage('Quantity must be a non-negative integer')
};

// Shop/User validation
const validateSignUp = [
    body('name')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Name must be between 2 and 50 characters'),
    
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
    
    handleValidationErrors
];

const validateSignIn = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    
    body('password')
        .notEmpty()
        .withMessage('Password is required'),
    
    handleValidationErrors
];

// Product validation
const validateCreateProduct = [
    body('product_name')
        .trim()
        .isLength({ min: 2, max: 150 })
        .withMessage('Product name must be between 2 and 150 characters'),
    
    body('product_thumb')
        .notEmpty()
        .withMessage('Product thumbnail is required')
        .isURL()
        .withMessage('Product thumbnail must be a valid URL'),
    
    body('product_description')
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage('Product description must not exceed 1000 characters'),
    
    body('product_price')
        .isFloat({ min: 0 })
        .withMessage('Price must be a positive number'),
    
    body('product_quantity')
        .isInt({ min: 0 })
        .withMessage('Quantity must be a non-negative integer'),
    
    body('product_type')
        .isIn(['Electronic', 'Clothing', 'Furniture'])
        .withMessage('Product type must be Electronic, Clothing, or Furniture'),
    
    body('product_attributes')
        .isObject()
        .withMessage('Product attributes must be an object'),
    
    handleValidationErrors
];

const validateUpdateProduct = [
    param('productId').isMongoId().withMessage('Invalid product ID'),
    
    body('product_name')
        .optional()
        .trim()
        .isLength({ min: 2, max: 150 })
        .withMessage('Product name must be between 2 and 150 characters'),
    
    body('product_price')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Price must be a positive number'),
    
    body('product_quantity')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Quantity must be a non-negative integer'),
    
    handleValidationErrors
];

// Cart validation
const validateAddToCart = [
    body('product')
        .isObject()
        .withMessage('Product information is required'),
    
    body('product.productId')
        .isMongoId()
        .withMessage('Invalid product ID'),
    
    body('product.quantity')
        .isInt({ min: 1 })
        .withMessage('Quantity must be at least 1'),
    
    handleValidationErrors
];

const validateUpdateCart = [
    body('shop_order_ids')
        .isArray({ min: 1 })
        .withMessage('Shop order IDs must be a non-empty array'),
    
    body('shop_order_ids.*.shopId')
        .isMongoId()
        .withMessage('Invalid shop ID'),
    
    body('shop_order_ids.*.item_products')
        .isArray({ min: 1 })
        .withMessage('Item products must be a non-empty array'),
    
    handleValidationErrors
];

// Discount validation
const validateCreateDiscount = [
    body('name')
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Discount name must be between 2 and 100 characters'),
    
    body('description')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Description must not exceed 500 characters'),
    
    body('type')
        .isIn(['fixed_amount', 'percentage'])
        .withMessage('Discount type must be fixed_amount or percentage'),
    
    body('value')
        .isFloat({ min: 0 })
        .withMessage('Discount value must be a positive number'),
    
    body('max_uses')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Max uses must be at least 1'),
    
    body('start_date')
        .isISO8601()
        .withMessage('Start date must be a valid date'),
    
    body('end_date')
        .isISO8601()
        .withMessage('End date must be a valid date')
        .custom((endDate, { req }) => {
            if (new Date(endDate) <= new Date(req.body.start_date)) {
                throw new Error('End date must be after start date');
            }
            return true;
        }),
    
    handleValidationErrors
];

// Order validation
const validateCheckoutReview = [
    body('cartId')
        .isMongoId()
        .withMessage('Invalid cart ID'),
    
    body('shop_order_ids')
        .isArray({ min: 1 })
        .withMessage('Shop order IDs must be a non-empty array'),
    
    handleValidationErrors
];

// Query validation
const validateProductQuery = [
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100'),
    
    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be at least 1'),
    
    query('sort')
        .optional()
        .isIn(['ctime', '-ctime', 'price', '-price', 'name', '-name'])
        .withMessage('Invalid sort parameter'),
    
    query('filter')
        .optional()
        .isIn(['published', 'draft'])
        .withMessage('Filter must be published or draft'),
    
    handleValidationErrors
];

module.exports = {
    handleValidationErrors,
    commonValidations,
    validateSignUp,
    validateSignIn,
    validateCreateProduct,
    validateUpdateProduct,
    validateAddToCart,
    validateUpdateCart,
    validateCreateDiscount,
    validateCheckoutReview,
    validateProductQuery
};
