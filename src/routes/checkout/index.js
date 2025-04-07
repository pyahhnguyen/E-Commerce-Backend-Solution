const express = require('express');
const CheckoutController = require('../../controller/checkout.controller');
const router = express.Router();
const { authentication } = require('../../auth/authUtils');
const asyncHandler = require('../../helper/asyncHandler');


router.post('/review', asyncHandler(CheckoutController.checkoutReview));

module.exports = router; 