'use strict'

const { model, Schema} = require('mongoose')
const  DOCUMENTS_NAME = 'Order'
const  COLLECTION_NAME = 'Orders'

const orderSchema = new Schema({
    order_userId: {type: Number, required: true},
    order_checkout: {type: Object, default: {}},
    order_shipping: {type: Object, default: {}},
    order_payment: {type: Object, default: {}},
    order_products: {type: Array, required: true},
    order_trackingNumber: {type: String, default: '#0000119552023'},
    order_status : {type: String, enum: ['pending', 'comfirmed', 'cancelled', 'shipped', 'delivered', 'returned' ], default: 'pending'}
}, {
    collection: COLLECTION_NAME,
    timestamps: true
})

module.exports = {
    order : model(DOCUMENTS_NAME, orderSchema)
}