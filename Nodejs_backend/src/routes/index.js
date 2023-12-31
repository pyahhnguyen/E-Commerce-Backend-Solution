const express = require('express');
const router = express.Router();


router.use('/v1/api', require('./access'));
// Root route
router.get('/', (req, res) => {
    return res.status(200).json({ 
      message: "Welcome to the shopDev",
    });
  });
  
  
module.exports = router;