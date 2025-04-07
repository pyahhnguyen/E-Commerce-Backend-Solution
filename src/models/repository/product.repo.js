'use strict'
const { product, clothing, electronic, furniture } = require('../product.model');
const { Types } = require('mongoose')
const { BadRequestError } = require('../../core/error.response');
const { getSelectData, unGetSelectData, convertToObjectIdMongodb } = require('../../utils/index');
const { findOne } = require('../cart.model');

// find all draft product for shop
const findAllDraftForShop = async ({ query, limit, skip }) => {
    return await queryproduct({ query, limit, skip })
}
//update product
const updateProductById = async ({ 
    productID, 
    bodyUpdate, 
    model,
    isNew  = true

}) => {    
    return await model.findByIdAndUpdate(productID, bodyUpdate,{
        new: isNew,
    })
}
    
// find all published product for shop
const findAllPublishedForShop = async ({ query, limit, skip }) => {
    return await queryproduct({ query, limit, skip })
}

// publish product
const publishProductByShop = async ({ product_shop, product_id }) => {
    const foundShop = await product.findOne({
        product_shop: new Types.ObjectId(product_shop),
        _id: new Types.ObjectId(product_id)
    })
    if (!foundShop) return null

    foundShop.isDraft = false
    foundShop.isPublished = true
    const { modifiedCount } = await foundShop.updateOne(foundShop)
    return modifiedCount
}

// unpublish product
const unPublishProductByShop = async ({ product_shop, product_id }) => {
    const foundShop = await product.findOne({
        product_shop: new Types.ObjectId(product_shop),
        _id: new Types.ObjectId(product_id)
    })
    if (!foundShop) return null

    foundShop.isDraft = true
    foundShop.isPublished = false
    const { modifiedCount } = await foundShop.updateOne(foundShop)
    return modifiedCount
}


// search  product
const searchProducts = async ({ keySearch }) => {
    const regexSearch = new RegExp(keySearch)
    const results = await product.find({
        isDraft: false,
        $text: { $search: regexSearch }
    }, { score: { $meta: 'textScore' } })
        .sort({ score: { $meta: 'textScore' } }).lean()
    return results

}


// find all product
const findAllProducts = async ({ limit, sort, page, filter, select }) => {
    const skip = (page - 1) * limit
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }
    const products = await product.find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean()
    .exec()
    return products

}


const findProducts = async ({ product_id, unSelect }) => {
    return await product.findById(product_id).select(unGetSelectData(unSelect))
}

const queryproduct = async ({ query, limit, skip }) => {
    return await product.find(query).
        populate('product_shop', 'name eamil -_id')
        .sort({ updateAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec()
}

const getProductById = async (product_id) => {
    return await product.findOne({ _id: convertToObjectIdMongodb(product_id) }).lean()
}

const checkProductByServer = async (products) => {
    return await Promise.all(products.map(async product => {
        const foundProduct = await getProductById(product.productId)
        if (foundProduct) {
            return {
                price: foundProduct.product_price,
                quantity: product.quantity,
                productId: product.productId,
            }
        }
        return null
    }))
}

module.exports = {
    findAllDraftForShop,
    publishProductByShop,
    findAllPublishedForShop,
    unPublishProductByShop,
    searchProducts,
    findAllProducts,
    findProducts,
    updateProductById,
    getProductById,
    checkProductByServer
}


