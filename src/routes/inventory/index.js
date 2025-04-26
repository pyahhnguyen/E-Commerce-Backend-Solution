const express = require('express');
const InventoryController = require('../../controller/inventory.controller')
const router = express.Router();
const { authentication } = require('../../auth/authUtils');
const asyncHandler = require('../../helper/asyncHandler');


router.use(authentication)
router.post('', asyncHandler(InventoryController.addStockToInventory));

module.exports = router; 