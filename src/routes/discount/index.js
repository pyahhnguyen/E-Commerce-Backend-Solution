const express = require('express');
const discountController = require('../../controller/discount.controller');
const router = express.Router();
const { authentication } = require('../../auth/authUtils');
const asyncHandler = require('../../helper/asyncHandler');


// get amount a discount
router.post('/amount', asyncHandler(discountController.getDiscountAmount))
router.get('/list_product_code',asyncHandler(discountController.getAllDiscountCodesWithProduct))

/// Authenticate all routes below
router.use(authentication);
    

router.post('', asyncHandler(discountController.createDiscountCode));
router.get('', asyncHandler(discountController.getAllDiscountCodes));
module.exports = router; 