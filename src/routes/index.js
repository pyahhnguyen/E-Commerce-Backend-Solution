const { checkPrime } = require('crypto');
const express = require('express');
const router = express.Router();
const {apikey, permission} = require('../auth/checkAuth')

//check apiKey
router.use(apikey);

//check permission 
router.use(permission('0000'))

// checkout
router.use('/v1/api/checkout', require('./checkout'));
// cart
router.use('/v1/api/cart', require('./cart'))
//discount
router.use('/v1/api/discount', require('./discount'))
// inventory
router.use('/v1/api/inventory', require('./inventory'))
// product 
router.use('/v1/api/product', require('./product'));
// access
router.use('/v1/api', require('./access')); 

// Root route
router.get('/', (req, res) => {
    return res.status(200).json({ 
      message: "Welcome to the shopDev",
    });
  });
  
  
module.exports = router;  


