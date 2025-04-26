'use strict';

const { convertToObjectIdMongodb } = require('../../utils/index') 
const inventory = require('../inventory.model')

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


const reservationInventory = async ({
    productId,
    quantity,
    cartId
}) => {
    const query = {inven_productId: convertToObjectIdMongodb(productId), inven_stock: {$gte: quantity}},
    updateSet = {
        $inc: {
            inven_stock: -quantity
        },
        $push: {
            inven_reservations: {
                quantity,
                cartId,
                createOn: new Date()
            }
        }
    }, options = {upsert: true, new: true}

    return await inventory.updateOne(query, updateSet)
}
    
module.exports = {
    insertInventory, 
    reservationInventory
};