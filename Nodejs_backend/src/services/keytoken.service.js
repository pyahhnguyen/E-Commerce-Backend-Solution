
const keytokenModel = require('../models/keytoken.model')
const { Types } = require('mongoose')
class KeyTokenService {
    static createKeyToken = async ({userId , publicKey, privateKey, refreshToken}) => {
        try{
           // --Level 0--
            // const tokens = await keytokenModel.create({
            //     user: userId,
            //     publicKey,
            //     privateKey

            // })
            // return tokens ? publicKeyString : null
            
        // Level xxx
        const filter = { user: userId}, update = {
            publicKey,
            privateKey,
            refreshTokensUsed: [],
            refreshToken
        }, options = { new: true, upsert: true}

        const tokens = await keytokenModel.findOneAndUpdated(filter, update, options )
        return tokens ? tokens.publicKey : null

        }catch(error){
    
            return(error)

        }
    }


    static findByUserId = async (userId) => {
        return await keytokenModel.findOne({user: Types.ObjectId(userId)}).lean()
    }

    static  removeKeyById = async (id) => {
        return await keytokenModel.remove(id)
    }

}

module.exports = KeyTokenService