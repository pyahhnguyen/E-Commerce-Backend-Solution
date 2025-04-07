'use strict';

const inventory = require('../inventory.model');
const { Types } = require('mongoose')

const insertInventory = async ({
    product_id,
    shopId,
    stock,
    location = "unknown"
}) => {
    return await inventory.create({
        inven_productId : product_id,
        inven_shopId : shopId,
        inven_stock : stock,
        inven_location : location
    })
}
    
module.exports = {
    insertInventory
}