const express = require('express');
const accessController = require('../../controller/access.controller');
const router = express.Router();


// Signup 
router.post('/shop/signup', accessController.signUp)
  
module.exports = router;