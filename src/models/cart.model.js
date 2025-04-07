
'use strict'

const {model, Schema, default: mongoose} = require('mongoose')

const DOCUMENT_NAME = 'Cart'
const COLLECTION_NAME = 'Carts'

// Declare the Schema of the Mongo model

const cartSchema  = new Schema({

    cart_state:{
        type: String,
        enum: ['active', 'inactive', 'completed', 'failed', 'pending'],
        required: true,
        default: 'active'
    },
    cart_products: {
        type : Array,
        required: true,
        default: []

        /*
            [
                {
                    productId:
                    quantity:
                    price:
                    name:
                    shopId:
                }
            ]
        */
    },
    cart_count_products: {
        type: Number,
        default: 0
    },
    cart_userId :{
        type: Number,
        required: true
    },


}, {
    collection: COLLECTION_NAME,
    timestamps: { createdAt: 'createdOn', updatedAt: 'updatedOn' },
    } 
)

//Export the model
module.exports = model(DOCUMENT_NAME, cartSchema);