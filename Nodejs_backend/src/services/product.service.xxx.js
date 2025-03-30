'use strict'

const { product, clothing, electronic, furniture } = require('../models/product.model');
const { BadRequestError } = require('../core/error.response');
const { findAllDraftForShop, 
    publishProductByShop,
    findAllPublishedForShop,
    unPublishProductByShop, 
    searchProducts,
    findAllProducts,
    findProducts,
    updateProductById

} = require('../models/repository/product.repo');

const {removeundefinedObject, updateNestedObjectParser} = require('../utils/index');
const { insertInventory } = require('../models/repository/inventory.repo');
//define a factory class to create a product 
class ProductFactory {
    /*
        type: "Clothing" , "Electronic"
    */
    static productRegistry = {}   // key class
    static registerProductType(type, classRef) {
        ProductFactory.productRegistry[type] = classRef
    }
    // create product
    static async createProduct(type, payload) {
        const productClass = ProductFactory.productRegistry[type]
        if (!productClass) throw new BadRequestError(`Invalid product type  ${type}`)
        return new productClass(payload).createProduct()
    }

    // update product
    static async updateProduct(type, productID, payload) {
        const productClass = ProductFactory.productRegistry[type]
        if (!productClass) throw new BadRequestError(`Invalid product type  ${type}`)
        return new productClass(payload).updateProduct(productID)
    }   

    /** Get all publish product for shop */
    static async findAllPublishedForShop({ product_shop, limit = 50, skip = 0 }) { 

        const query = { product_shop, isPublished: true }
        return await findAllPublishedForShop({ query, limit, skip })
    }
    // publish product - PUT 
    static async publishProductByShop({ product_shop, product_id }) {
        return await publishProductByShop({ product_shop, product_id })
    }

    // unpublish product
    static async unPublishProductByShop({ product_shop, product_id }) {
        return await unPublishProductByShop({ product_shop, product_id })
    }

      // query //
    /** Get all drafts product for shop  */
    static async findAllDraftForShop({ product_shop, limit = 50, skip = 0 }) {
        const query = { product_shop, isDraft: true }
        return await findAllDraftForShop({ query, limit, skip })
    }
    // search product 
    static async searchProducts({ keySearch }) {
        return await searchProducts({ keySearch })
    }
    // find all product
    static async findAllProducts({ limit = 50, sort = 'ctime', page = 1, filter = { isPublished: true } }){
        return await findAllProducts({limit, sort, filter, page, 
            select: ['product_name', 'product_thumb', 'product_price', 'product_shop']  
        })
    }
    // find product     
    static async findProducts({product_id}) {
        return await findProducts({product_id, unSelect: ['__v','product_variations']}) 
        }
    }

// define base product class  

class Product {
    constructor({
        product_name, product_thumb, product_description, product_type,
        product_price, product_quantity, product_shop, product_attributes
    }) {
        this.product_name = product_name;
        this.product_thumb = product_thumb;
        this.product_description = product_description;
        this.product_price = product_price;
        this.product_quantity = product_quantity;
        this.product_type = product_type;
        this.product_shop = product_shop;
        this.product_attributes = product_attributes
    }

    // create new product 
    async createProduct(product_id) {
        const newProduct =  product.create({ ...this, _id: product_id })
        // add new product to inventory

            if (newProduct){
                await insertInventory(
                    {
                        product_id: newProduct._id,
                        shopId: this.product_shop,
                        stock: this.product_quantity
                    }
                )
            }

        return newProduct
    }

    // update product 
    async updateProduct(productID, bodyUpdate) {
        return await updateProductById({productID, bodyUpdate, model: product })
    }

}

// Define sub-class for different product types clothing 
class Clothing extends Product {

    async createProduct() {

        const newClothing = await clothing.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })

        if (!newClothing) throw new BadRequestError('Creare new clothing error')

        const newProduct = await super.createProduct()
        if (!newProduct) throw new BadRequestError('Create new product error')

        return newProduct
    }


    // update product
    async updateProduct(productID) {

        /***
         *  1 remove attributes has null, undefined, empty string
         * ! 2 check xem update cho nao 
         */
        const objectParam = removeundefinedObject(this)

        if(objectParam.product_attributes){

            updateProductById({
                productID,
                bodyUpdate: updateNestedObjectParser(objectParam.product_attributes), 
                model: clothing })
        }
        const updateProduct = await super.updateProduct(productID, updateNestedObjectParser(objectParam))
        return updateProduct

        }
}


// Define sub-class for different product types electronic
class Electronic extends Product {

    async createProduct() {
        const newFurniture = await electronic.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if (!newFurniture) throw new BadRequestError('Creare new electronic error')

        const newProduct = await super.createProduct(newFurniture._id)
        if (!newProduct) throw new BadRequestError('Create new product error')

        return newProduct
    }
}

// Define sub-class for different product types electronic
class Furniture extends Product {

    async createProduct() {
        const newFurniture = await furniture.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if (!newFurniture) throw new BadRequestError('Creare new electronic error')

        const newProduct = await super.createProduct(newFurniture._id)
        if (!newProduct) throw new BadRequestError('Create new product error')

        return newProduct
    }
}


//register product type
ProductFactory.registerProductType('Electronic', Electronic)
ProductFactory.registerProductType('Clothing', Clothing)
ProductFactory.registerProductType('Furniture', Furniture)


module.exports = ProductFactory;