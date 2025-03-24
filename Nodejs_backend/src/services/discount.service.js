'use strict'
const { BadRequestError, NotFoundError } = require('../core/error.response');
const discountModel = require('../models/discount.model');
const products = require('../models/product.model');
const { convertToObjectIdMongodb } = require('../utils/index');
const { findAllProducts } = require('../models/repository/product.repo');
const { findAllDiscountCodesUnselect, checkDiscoundExist } = require('../models/repository/discount.repo');
const { model } = require('mongoose');
/*
    Discount Service
    1- Get code discount code [Shop  | admin]
    2 - Get discount amount [User]
    3 - Get all discount codes [User | Shop]
    4- Verify discount code [User]
    5- Delete discount code [Shop | admin]
    6- Cancel discount code [User]
*/

class DiscountService {

    static async createDiscountCode (payload) {
            // Create discount code
            const { code, start_date, end_date, is_active,
                    shopId, min_order_value, product_ids, apply_to,max_value, users_uses, 
                    name, description, type, value, max_use, use_count, max_use_per_user } = payload 
            

            // check if start date is greater than current date
            if(new Date() < new Date(start_date) || new Date() > new Date(end_date)) {
                throw new BadRequestError('Discount code has expried!')
            }

            if (new Date(start_date) >= new Date(end_date)) {
                throw new BadRequestError('End date must be greater than current date')
            }

            // Create index for discount code 
            const foundDiscount = await discountModel.findOne({ 
                discount_code: code, 
                discount_shopId:  convertToObjectIdMongodb(shopId), }).lean();
                
            if(foundDiscount && foundDiscount.discount_is_active) {
                throw new BadRequestError('Discount code already exists')
            }

            const newDiscount = await discountModel.create({
                discount_name: name,
                discount_description: description,
                discount_type: type,
                discount_value: value,
                discount_code: code,
                discount_start_date: new Date(start_date),
                discount_end_date: new Date(end_date),
                discount_max_use: max_use,
                discount_max_value: max_value,
                discount_uses_count: use_count,
                discount_users_uses: users_uses,
                discount_max_use_per_user: max_use_per_user,
                discount_min_order_value: min_order_value || 0,
                discount_shopId: shopId,
                discount_is_active: is_active,
                discount_apply_to: apply_to,
                discount_product_ids: apply_to === "all" ? [] : product_ids,
            })

            return newDiscount
        }

        static async updateDiscountCode(discount_id, payload){
        // Find and update discount code
        const { code, start_date, end_date, is_active,
                min_order_value, product_ids, apply_to, max_value, users_uses,
                name, description, type, value, max_use, use_count, max_use_per_user } = payload

        // check if start date is greater than current date
        if(new Date() < new Date(start_date) || new Date() > new Date(end_date)) {
            throw new BadRequestError('Discount code has expired!')
        }

        if (new Date(start_date) >= new Date(end_date)) {
            throw new BadRequestError('End date must be greater than current date')
        }

        const updatedDiscount = await discountModel.findByIdAndUpdate(discount_id, {
            discount_name: name,
            discount_description: description,
            discount_type: type, 
            discount_value: value,
            discount_code: code,
            discount_start_date: new Date(start_date),
            discount_end_date: new Date(end_date),
            discount_max_use: max_use,
            discount_max_value: max_value,
            discount_uses_count: use_count,
            discount_users_uses: users_uses,
            discount_max_use_per_user: max_use_per_user,
            discount_min_order_value: min_order_value || 0,
            discount_is_active: is_active,
            discount_apply_to: apply_to,
            discount_product_ids: apply_to === 'specific' ? product_ids : []
        }, {
            new: true
        })

        if(!updatedDiscount) {
            throw new NotFoundError('Discount code not found')
        }

        return updatedDiscount
    }
        /*
            Get all discount codde availble with products
        */

            static async getAllDiscountCodesWithProducts({
                code,
                shopId,
                userId,
                limit,
                page,
            }) {
                // create index for discount_code
                const foundDiscount = await discountModel
                    .findOne({
                        discount_code: code,
                        discount_shopId: convertToObjectIdMongodb(shopId),
                    })
                    .lean();
        
                if (!foundDiscount || !foundDiscount.discount_is_active) {
                    throw new NotFoundError("discount not exists!");
                }
        
                const { discount_applies_to, discount_product_ids } = foundDiscount;
                let products;
                if (discount_applies_to === "all") {
                    // get all product
                    products = await findAllProducts({
                        filter: {
                            product_shop: convertToObjectIdMongodb(shopId),
                            isPublished: true,
                        },
                        limit: +limit,
                        page: +page,
                        sort: "ctime",
                        select: [ "product_name" ],
                    });
                }
        
                if (discount_applies_to === "specific") {
                    // get the products ids
                    products = await findAllProducts({
                        filter: {
                            _id: { $in: discount_product_ids },
                            isPublished: true,
                        },
                        limit: +limit,
                        page: +page,
                        sort: "ctime",
                        select: [ "product_name" ],
                    });
                }
        
                return products;
            }
        /*
            Get all discount codes of shop 
        */

        static async getAllDiscountCodesByShop({limit, page, shopId}){ 
            const discounts = await findAllDiscountCodesUnselect({
                limit: +limit,
                page: +page,
                filter: { discount_shopId: convertToObjectIdMongodb(shopId),
                            discount_is_active: true },
                unSelect: ['__v', 'discount_shopId'],
                model: discountModel

            })

            return discounts
        }


        /*
            Apply discount code
        */

        static async getDiscountAmount({codeId, shopId, userId, products}) {
            const foundDiscount = await checkDiscoundExist({
                model: discountModel,
                filter: { 
                    discount_code: codeId,
                    discount_shopId: convertToObjectIdMongodb(shopId) 
                }
            })

            if(!foundDiscount) {
                throw new NotFoundError('Discount code does not exist')
            }


            // define discount code properties
            const { discount_min_order_value,
                discount_users_uses,
                discount_start_date,
                discount_end_date,
                discount_max_use_per_user,
                discount_type,
                discount_value, 
                discount_is_active,
                discount_max_use
    
            } = foundDiscount

            if(!discount_is_active) {
                throw new BadRequestError('Discount code has expired!')
            }
            if(!discount_max_use) {
                throw new BadRequestError('Discount are out!')
            }
            if(new Date() < new Date(foundDiscount.discount_start_date) || new Date() > new Date(foundDiscount.discount_end_date)) {
                throw new BadRequestError('Discount code has expired!')
            }
            // check minimum order value
            let totalOrder = 0
            if(discount_min_order_value > 0 ) {
                // get total price of products
                totalOrder = products.reduce((acc, product) => {
                    return acc + (product.quantity * product.price)
                }, 0)
                if(totalOrder < discount_min_order_value) {
                    throw new BadRequestError('Minimum order value not met!')
                }
            }

            if(discount_max_use_per_user > 0) {
                // check if user has used discount code
                const userUserDiscount = discount_users_uses.find(user => user.userId === userId)
                if(userUserDiscount) {
                    if(userUserDiscount.count >= discount_max_use_per_user) {
                        throw new BadRequestError('Discount code usage limit exceeded for this user!')
                    }
                }
            }

            // Calculate discount amount
            const amount = discount_type === 'fixed_amount' ? discount_value : totalOrder * (discount_value / 100)

            
            return {
                totalOrder,
                discount: amount,
                totalPrice: totalOrder - amount
            }
        }

        // delete discount code

        static async deleteDiscountCode({codeId, shopId}) {
            const deletedDiscount = await discountModel.findOneAndDelete(
                {
                    discount_code: codeId,
                    discount_shopId: convertToObjectIdMongodb(shopId)
                })
            if(!deletedDiscount) {
                throw new NotFoundError('Discount code not found')
            }

            return deletedDiscount
        }


        // Cancel discount code
        static async cancelDiscountCode({codeId, userId, shopId}) {
            const foundDiscount = await discountModel.findOne(
                {
                    model: discountModel,
                    filter: {
                        discount_code: codeId,
                        discount_shopId: convertToObjectIdMongodb(shopId)
                    }
                }
            )
            if(!foundDiscount) {
                throw new NotFoundError('Discount code not found')
            }
        
            const result = await discountModel.findByIdAndUpdate(foundDiscount._id, {
                $pull: {
                    discount_users_uses: { userId }
                },
                $inc: {
                    discount_uses_count: -1,
                    discount_max_use: 1
                }
            })

            return result
        }

}


module.exports = DiscountService;