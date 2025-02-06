'use strict'

const { product, clothing, electronic } = require('../models/product.model');
const { BadRequestError } = require('../core/error.response');

//define a factory class to create a product 
class ProductFactory {
    /*
        type: "Clothing" , "Electronic"
    */
    static async createProduct(type, payload){
        switch(type){
            case "Clothing":
                return await new Clothing(payload).createProduct()
            case "Electronic":
                return await new Electronic(payload).createProduct()
            default:
                throw new BadRequestError(`Invalid product type  ${type}`)
        }

    }
}
/*
    product_name: { type : String, required: true},
    product_thumb: { type: String, required: true},
    product_decription: String,
    product_price: { type : Number, required: true},
    product_quantity: { type : Number, required: true},
    product_type: { type: String, required: true, enum : ['Electronic','Clothing','Furniture']},
    product_shop: { type : Schema.Types.ObjectId, ref: 'Shop'},
    product_attributes: { type: Schema.Types.Mixed, required: true},

*/
//define base product class 

class Product {
    constructor({
        product_name, product_thumb, product_description, product_type,
        product_price, product_quantity, product_shop, product_attributes
    })

    {
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
    async createProduct(product_id){
        return await product.create({...this, _id:product_id})
    }
}

// Define sub-class for different product types clothing 
class Clothing extends Product {    

    async createProduct(){
        const newClothing = await clothing.create(this.product_attributes)
        if(!newClothing) throw new BadRequestError('Creare new clothing error')
        
        const newProduct = await super.createProduct()
        if(!newProduct) throw new BadRequestError('Create new product error')

        return newProduct
    }
}

// Define sub-class for different product types electronic
class Electronic extends Product {

    async createProduct(){
        const newElectronic = await electronic.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if(!newElectronic) throw new BadRequestError('Creare new electronic error')
        
        const newProduct = await super.createProduct(newElectronic._id)
        if(!newProduct) throw new BadRequestError('Create new product error')

        return newProduct
    }
}
    
module.exports =  ProductFactory;


/* flow of the code 
    !payload tu req.body duoc nhan tu req dua vao type se dong vai tro la q argument cua construct tuong 
    ! voi type do (Clothing hoac Electronic) se tao ra 1 instance moi cua class Clothing 
    * Boi vi than Clothing hoac Electronic no thua ke lai cua th class Product nen no se co tat ca method va o day co the goi 2 th nay la contructot 
    --> payload dong vai tro la argument cho construtor Clothing hoac Electronic.
    # Nen tai dong nay 
    const newClothing = await clothing.create(this.product_attributes)
    this.product_attributes duoc lay tu payload 
    --> cai payload bay het vao contructor cua Clothing (thua ke tu Product) va co the truy xuat den cac phan tu trong construtor thong qua toan tu "this'"
*/
