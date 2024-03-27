const { checkPrime } = require('crypto');
const express = require('express');
const router = express.Router();
const {apikey, permission} = require('../auth/checkAuth')

<<<<<<< HEAD

=======
>>>>>>> main
//check apiKey
router.use(apikey);

//check permission 
router.use(permission('0000'))

router.use('/v1/api', require('./access'));
<<<<<<< HEAD
=======
// product 

router.use('/v1/api/product', require('./product'));
>>>>>>> main
// Root route
router.get('/', (req, res) => {
    return res.status(200).json({ 
      message: "Welcome to the shopDev",
    });
  });
  
  
<<<<<<< HEAD
module.exports = router;
=======
module.exports = router;  


>>>>>>> main
