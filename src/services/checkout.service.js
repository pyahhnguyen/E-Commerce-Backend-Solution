'use strict';

const { BadRequestError, NotFoundError } = require('../core/error.response');
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
}

module.exports = CheckoutService;