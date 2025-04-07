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

    static async createUserCart({ userId, product }) {
        const query = { cart_userId: userId, cart_state: 'active' },
            updateOrInsert = {
                $addToSet: {
                    cart_products: product
                }
            }, options = { upsert: true, new: true }
        return await cartModel.findOneAndUpdate(query, updateOrInsert, options)
    }

    static async updateUserCartQuantity({ userId, product }) {
        const { productId, quantity } = product;
        const query = {
            cart_userId: userId,
            'cart_products.productId': productId,
            cart_state: 'active'
        }, updateSet = {
            $inc: {
                'cart_products.$.quantity': quantity
            }
        }, options = { upsert: true, new: true }

        return await cartModel.findOneAndUpdate(query, updateSet, options)
    }



    static async addToCart({ userId, product = {} }) {
        const userCart = await cartModel.findOne({ cart_userId: userId })
        if (!userCart) {
        
            return await CartService.createUserCart({ userId, product })
        }

      
        if (!userCart.cart_products.length) {
            userCart.cart_products = [ product ]
            return await userCart.save()
        }

        // Check if the product already exists in the cart
        const productExists = userCart.cart_products.some(
            item => item.productId.toString() === product.productId.toString()
        );
        
        if (!productExists) {
            // If product doesn't exist, add it to the cart
            userCart.cart_products.push(product);
            return await userCart.save();
        }

        //gio hang ton tai, co san pham thi update quantity
        return await CartService.updateUserCartQuantity({ userId, product })
    }


    static async addToCartV2({ userId, shop_order_ids }) {
        if (!shop_order_ids || !shop_order_ids[0] || !shop_order_ids[0].item_products || !shop_order_ids[0].item_products[0]) {
            throw new BadRequestError('Invalid shop_order_ids format');
        }

        const { productId, quantity, old_quantity } = shop_order_ids[0].item_products[0];
        //check product
        const foundProduct = await getProductById(productId)
        if (!foundProduct) throw new NotFoundError('Product not found')
        // compare
        if (foundProduct.product_shop.toString() !== shop_order_ids[0].shopId) {
            throw new NotFoundError('Product do not belong to the shop')
        }
        if (quantity === 0) {
            // deleted
            return await CartService.deleteUserCart({ userId, productId });
        }
        return await CartService.updateUserCartQuantity({
            userId,
            product: {
                productId,
                quantity: quantity - old_quantity
            }
        })
    }

    static async deleteUserCart({ userId, productId }) {
        const query = { cart_userId: userId, cart_state: 'active' },
            updateSet = {
                $pull: {
                    cart_products: {
                        productId
                    }
                }
            }
        const deleteCart = await cartModel.updateOne(query, updateSet)
        return deleteCart
    }

    static async getListUserCart({ userId }) {
        console.log('userId', userId);
        return await cartModel.findOne({
            cart_userId: +userId
        }).lean()
    }
}
 
module.exports = CartService; 