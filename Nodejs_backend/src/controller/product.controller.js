'use strict'

const { Ok, Created, SuccessResponse} = require('../core/success.response')
const ProductService = require("../services/product.service")
const ProductServiceV2 = require("../services/product.service.xxx")


class ProductController {

    createProduct = async(req, res, next) => {
        new SuccessResponse({
            message: 'Create Product OK!',
            metadata: await ProductServiceV2.createProduct(req.body.product_type, {
                ...req.body,
                product_shop: req.user.userId
            }
        )
        }).send(res)
    }

    // Query //
    /**
       * @description get all draft product  
       * @param {Number} limit
       * @param {Number} skip
       * @return {JSON} 
    * 
    */
    getAllDraftProduct = async(req, res, next) => {
        new SuccessResponse({
            message: 'Get list all draft product !!!',
            metadata: await ProductServiceV2.findAllDraftForShop({
                product_shop: req.user.userId
            })
        }).send(res)
    }

    
    getAllPublishedProduct = async(req, res, next) => {
        new SuccessResponse({
            message: 'Get list all published product !!!',
            metadata: await ProductServiceV2.findAllPublishedForShop({
                product_shop: req.user.userId
            })
        }).send(res)
    }

    // Publish product
    publishProduct = async(req, res, next) => {
        new SuccessResponse({
            message: 'Publish Product OK!',
            metadata: await ProductServiceV2.publishProductByShop({
                product_shop: req.user.userId,
                product_id: req.params.id
            })
        }).send(res)

    }

    // Unpublish product
    unPublishProduct = async(req, res, next) => {
        new SuccessResponse({
            message: 'Unpublish Product OK!',
            metadata: await ProductServiceV2.unPublishProductByShop({
                product_shop: req.user.userId,
                product_id: req.params.id
            })
        }).send(res)
    }






        // new SuccessResponse({
        //     message: 'Create Product OK!',
        //     metadata: await ProductService.createProduct(req.body.product_type, {
        //         ...req.body,
        //         product_shop: req.user.userId
        //     }
        // )
        // }).send(res)


    

}


module.exports = new ProductController();

