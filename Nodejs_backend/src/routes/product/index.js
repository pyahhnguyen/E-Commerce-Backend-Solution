const express = require('express');
const ProductController = require('../../controller/product.controller');
const router = express.Router();
const { authentication } = require('../../auth/authUtils');
const asyncHandler = require('../../helper/asyncHandler');

// authentication //
// router.use(authentication)
// create product
router.post('/createProduct', asyncHandler(ProductController.createProduct))


    
module.exports = router; 