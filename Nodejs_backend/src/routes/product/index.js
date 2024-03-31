const express = require('express');
const ProductController = require('../../controller/product.controller');
const router = express.Router();
const { authentication } = require('../../auth/authUtils');
const asyncHandler = require('../../helper/asyncHandler');


// get all product
router.get('', asyncHandler(ProductController.getAllProduct))
// search product
router.get('/search/:keySearch', asyncHandler(ProductController.getListSearchProduct))
// get product by id
router.get('/:product_id', asyncHandler(ProductController.getProduct))

//authentication //
router.use(authentication)
// create product
router.post('/createProduct', asyncHandler(ProductController.createProduct))

// publish product
router.post('/publish/:id', asyncHandler(ProductController.publishProduct))
// unpublish product
router.post('/unpublish/:id', asyncHandler(ProductController.unPublishProduct))

// query
router.get('/drafts/all', asyncHandler(ProductController.getAllDraftProduct))
router.get('/published/all', asyncHandler(ProductController.getAllPublishedProduct))



module.exports = router;