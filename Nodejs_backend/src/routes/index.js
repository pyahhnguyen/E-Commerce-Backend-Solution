const { checkPrime } = require('crypto');
const express = require('express');
const router = express.Router();
const {apikey, permission} = require('../auth/checkAuth')

//check apiKey
router.use(apikey);

//check permission 
router.use(permission('0000'))

router.use('/v1/api', require('./access'));
// product 

router.use('/v1/api/product', require('./product'));
// Root route
router.get('/', (req, res) => {
    return res.status(200).json({ 
      message: "Welcome to the shopDev",
    });
  });
  
  
module.exports = router;  


