'use strict'

const {model, Schema} = require('mongoose')

const DOCUMENT_NAME = 'Discount'
const COLLECTION_NAME = 'Discounts'

// Declare the Schema of the Mongo model

const discountSchema = new Schema({
    discount_name: {type: String, required: true},
    discount_description: {type: String, required: true},
    discount_type: {type: String, default: 'fixed_amount'}, // fixed_amount, percentage
    discount_value: {type: Number, required: true},
    discount_code: {type: String, required: true},
    discount_start_date: {type: Date, required: true},
    discount_end_date: {type: Date, required: true},
    discount_max_use: {type: Number, required: true},  // number of time the discount can be used
    discount_uses_count: {type: Number, default: 0}, // number of time the discount has been used
    discount_users_uses: {type: Array, default: []}, // list of users who have used the discount
    discount_max_use_per_user: {type: Number, required: true}, // number of time the discount can be used by a user
    discount_min_order_value: {type: Number, required: true}, // minimum order value to use the discount
    discount_max_value: {type: Number, required: true}, // maximum value of the discount
    discount_shopId: {type: Schema.Types.ObjectId, ref: 'Shop'},
    discount_is_active: {type: Boolean, default: true},
    discount_apply_to: {type: String, required: true, enum: ['all','specific']}, // all, product, category
    discount_product_ids: {type: Array, default: []}, // list of products the discount applies to
}, {
    collection: COLLECTION_NAME,
    timestamps: true, 
});


//Export the model
module.exports = model(DOCUMENT_NAME, discountSchema);