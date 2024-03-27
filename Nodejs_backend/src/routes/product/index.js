const express = require('express');
const ProductController = require('../../controller/product.controller');
const router = express.Router();
const { authentication } = require('../../auth/authUtils');
const asyncHandler = require('../../helper/asyncHandler');

//authentication //
router.use(authentication)
// create product
router.post('/createProduct', asyncHandler(ProductController.createProduct))

// publish product
router.post('/publish/:id', asyncHandler(ProductController.publishProduct))

// query
router.get('/drafts/all', asyncHandler(ProductController.getAllDraftProduct))
router.get('/published/all', asyncHandler(ProductController.getAllPublishedProduct))



module.exports = router;