'use strict'

const { BadRequestError, NotFoundError } = require('../core/error.response');
const { Types } = require('mongoose');
const cartModel = require('../models/cart.model');
const { getProductById } = require('../models/repository/product.repo');
/*
    - add item to cart
    - reduce product quantity
    - incerease porduct quantity\
    - get cart 
    - delete item from cart
    - delete cart 
*/

class CartService {


     // start repo cart 
    static async createUserCart({ userId, product}) {
        const query = {
            cart_userId: userId, 
            cart_state: 'active',
        },
        updateOrInsert = {
            $addToSet: {
                cart_products: product
            }
        }, options = { upsert: true, new: true }
            return await cartModel.findOneAndUpdate(query, updateOrInsert, options)
    } 

    static async updateUserCartQuantity({ userId, product}) {
        const {productId, quantity} = product
        const query = {
            cart_userId: userId,
            cart_state: 'active',
            'cart_products.productId': productId
        },
        update = {  
            $inc: {
                'cart_products.$.quantity': quantity
            }
        },
        options = {
            new: true,
            upsert: true
        }
        return await cartModel.findOneAndUpdate(query, update, options)
    }
    
    static  async addToCart({ userId, product = { }}) {
    
        // check cart is exist
        const userCart = await cartModel.findOne({ cart_userId: userId })
        if(!userCart){
            // create cart for user
            return await CartService.createUserCart({ userId, product })

        }   

        // if have cart but product not exist
        if(!userCart.cart_products.length){
            userCart.cart_products = [product]
            return await userCart.save()

        }
        // if have cart and product exist, update quantity

        return await CartService.updateUserCartQuantity({ userId, product })
    
    }

    // update cart 
    /*
        shop_orderId : [
            shopId: 1,
            item_products: [
                {
                    productId: 1,
                    quantity: 2,
                    price: 100,
                    shopId: 1,
                    old_quantity: 2,
                    quantity: 4,
                }
            ]}
    */

    static async addToCartV2({ userId,shop_order_ids}) {

        const {productId, quantity, old_quantity} = shop_order_ids[0]?.item_products[0]
        // check cart is exist
        const foundProduct = await getProductById(productId)
        if(!foundProduct) throw new NotFoundError('Product not found')

        // compare 
        if (foundProduct.product_shop.toString() !== shop_order_ids[ 0 ]?.shopId) {
            throw new NotFoundError('Product do not belong to the shop')
        }
        if (quantity === 0) {
            // deleted
        }
        return await CartService.updateUserCartQuantity({
            userId,
            product: {
                productId,
                quantity: quantity - old_quantity
            }
        })

    }

    //delete cart
    static async deleteUserCart({ userId, productId }) {
        const query = {
            cart_userId: userId,
            cart_state: 'active'
        }, 
        updateSet = {
            $pull: {
                cart_products: {
                    productId
                }
            }
        }

        const deletedCart = await cartModel.findOneAndUpdate(query, updateSet)
        return deletedCart 
    }

    // get cart
    static async getListUserCart({ userId }) {
        return await cartModel.findOne({ cart_userId: +userId }).lean()
    }

}




module.exports = CartService