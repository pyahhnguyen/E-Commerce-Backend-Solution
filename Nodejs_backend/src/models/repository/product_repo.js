'use strict'
const { product, clothing, electronic, furniture } = require('../../models/product.model');
const {Types } = require('mongoose')
const { BadRequestError } = require('../../core/error.response');


// find all draft product for shop
const findAllDraftForShop = async ({query, limit , skip}) => {
    return await queryproduct({query, limit , skip})
}
// find all published product for shop
const findAllPublishedForShop = async ({query, limit , skip}) => {
    return await queryproduct({query, limit , skip})
}

// publish product
const  publishProductByShop = async({product_shop, product_id}) => {
    const foundShop = await product.findOne({
        product_shop: new Types.ObjectId(product_shop),
        _id: new Types.ObjectId(product_id)
    })       
    if(!foundShop) return null

    foundShop.isDraft = false
    foundShop.isPublished = true
    const {modifiedCount} = await foundShop.updateOne(foundShop)
    return modifiedCount    
}

// unpublish product
const  unPublishProductByShop = async({product_shop, product_id}) => {
    const foundShop = await product.findOne({
        product_shop: new Types.ObjectId(product_shop),
        _id: new Types.ObjectId(product_id)
    })       
    if(!foundShop) return null

    foundShop.isDraft = true
    foundShop.isPublished = false
    const {modifiedCount} = await foundShop.updateOne(foundShop)
    return modifiedCount    
}


// search  product
const searchProducts = async({keySearch}) => {
    const regexSearch = new RegExp(keySearch)
    const result = await product.find({})

}



const queryproduct = async ({query, limit , skip}) => {
    return await product.find(query).
        populate('product_shop','name eamil -_id')
        .sort({updateAt: -1})
        .skip(skip)
        .limit(limit)
        .lean()
        .exec()
}
module.exports = {
    findAllDraftForShop,
    publishProductByShop,
    findAllPublishedForShop,
    unPublishProductByShop
}


