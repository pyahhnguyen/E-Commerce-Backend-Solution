'use strict';

const { BadRequestError, NotFoundError } = require('../core/error.response');
const { order } = require('../models/order.model');
const { findCartById } = require('../models/repository/cart.repo')
const {checkProductByServer}  = require('../models/repository/product.repo')
const { getDiscountAmount } = require('../services/discount.service')

class CheckoutService {
    
    /*
        {
            "userId": ,
            "cartId": ,
            "shop_order_ids": [
                {
                    "shopId
                    shop_discount : [
                    {
                        shopId
                        discountId:
                        codeId
                    }] 
                    item_product :[{
                        price: ,
                        quantity: ,
                        productId: ,
                    }]
                ]
            }
    */

    static async checkoutReview({userId, cartId, shop_order_ids}) {
        const foundCart = await findCartById(cartId) 
        if(!foundCart) throw new BadRequestError('Cart not found')

        const checkout_order = {
            totalPrice: 0,
            feeShip: 0,
            totalDiscount: 0,
            totalCheckout: 0,
        }, shop_order_ids_new = []

        // calculate total price for each shop order
        for ( let i = 0; i < shop_order_ids.length; i++) {
            const {shopId, shop_discounts = [], item_products = [] } = shop_order_ids[i]
            /// check if shopId is valid
            const checkProductServer = await checkProductByServer(item_products)
            console.log('checkProductServer:::', checkProductServer)
            if(!checkProductServer[0]) throw new BadRequestError('Order wrong')

            // price of order
            const checkoutPrice = item_products.reduce((acc, product) => {
                return acc + (product.price * product.quantity)

            }, 0)

            // price before processing 
            checkout_order.totalPrice += checkoutPrice

            const itemCheckout = {
                shopId,
                shop_discounts,
                priceRaw: checkoutPrice, // price before discount
                priceApplyDiscount: checkoutPrice, // price after discount
                item_products : checkProductServer,
            }

            // if shop_discount exist > 0,  check the validation
            if(shop_discounts.length > 0) {
                const { totalPrice = 0, discount = 0} = await getDiscountAmount({
                    codeId: shop_discounts[0].codeId,
                    userId,
                    shopId,
                    products: checkProductServer,
                })
                
                checkout_order.totalDiscount += discount

                if(discount > 0) {
                    // apply discount to checkout price
                    itemCheckout.priceApplyDiscount = checkoutPrice - discount
                }
            }
            // final price after discount
            checkout_order.totalCheckout += itemCheckout.priceApplyDiscount
            shop_order_ids_new.push(itemCheckout)


        }

        return {
            shop_order_ids,
            shop_order_ids_new,
            checkout_order
            
        }
    }

    static async orderByUser(userId, cartId, shop_order_ids, user_address = {}, user_payment = {}) {
        const {shop_order_ids_new, checkout_order} = await this.checkoutReview({userId, cartId, shop_order_ids});

        // get new array product 
        const products = shop_order_ids_new.flatMap(item => item.item_products)
        console.log('products:::', products)
        const acquireProduct = []
        for (let i = 0; i < products.length; i++) {
            const {productId, quantity} = products[i]
            const keyLock = await acquireLock(productId, quantity, cartId)
            acquireProduct.push(keyLock ? true : false)
            if(keyLock) {
                await releaseLock(keyLock)
            }
            
        }

        // check if one product is put of stock 
        if(acquireProduct.includes(false)){
            throw new BadRequestError('Some products are updated, please check your cart again')
        }

        const newOrder = await order.create({
            order_userId: userId,
            order_checkout: checkout_order,
            order_shipping: user_address,
            order_payment: user_payment,
            order_products: shop_order_ids_new
        })

        if(newOrder) {
            // remove product in cart
            
        }
        return newOrder

    }

    // /*
    //     1> Query order [Users]
    // */
    // static async getOrdersByUser({

    // })


    // /*
    //     2> Query order using id [Users]
    // */
    //     static async getOneOrderByUser({

    //     })


    // /*
    //     3> Cancel orders [Users]
    // */
    //     static async cancelOrderByUser({

    //     })


    // /*
    //     4> Update order stattus [Shop|Admin]
    // */
    //     static async updateOrderStatusbyShop({

    //     })



}

module.exports = CheckoutService;