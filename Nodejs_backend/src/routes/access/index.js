const express = require('express');
const accessController = require('../../controller/access.controller');
const router = express.Router();
const { authentication } = require('../../auth/authUtils');
const asyncHandler = require('../../helper/asyncHandler');



// Signup shop
router.post('/shop/signup', asyncHandler(accessController.signUp))
router.post('/shop/login', asyncHandler(accessController.login))
  

// authentication //
router.use(authentication)
// logout
router.post('/shop/logout', asyncHandler(accessController.logout))
<<<<<<< HEAD


    
module.exports = router;
=======
router.post('/shop/handleRefreshToken', asyncHandler(accessController.handleRefreshToken))


    
module.exports = router; 
>>>>>>> main
