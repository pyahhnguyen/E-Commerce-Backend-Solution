'use strict'

const DiscountService = require('../services/discount.service')
const { SuccessResponse } = require('../core/success.response')



class DiscountController {

    createDiscountCode = async (req, res, next) => {
        new SuccessResponse({
            message: 'Create Discount Code OK!',
            metadata: await DiscountService.createDiscountCode({...req.body, 
                shopId: req.user.userId
            })
        }).send(res)
    }


    getAllDiscountCodes = async (req, res, next) => {
        new SuccessResponse({
            message: 'Successful codes found !!!',
            metadata: await DiscountService.getAllDiscountCodesByShop({
                ...req.query,
                shopId: req.user.userId
            })
        }).send(res)
    }

    getDiscountAmount = async (req, res, next) => {
        new SuccessResponse({
            message: 'Successful discount amount found !!!',
            metadata: await DiscountService.getDiscountAmount({
                ...req.body,
            })
        }).send(res)
    }

    getAllDiscountCodesWithProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'successfully code found',
            metadata: await DiscountService.getAllDiscountCodesWithProducts({
                ...req.query,
            })
        }).send(res)
    }


}



module.exports = new DiscountController()