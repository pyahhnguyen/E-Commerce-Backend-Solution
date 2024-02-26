
const keytokenModel = require('../models/keytoken.model')
const { Types: { ObjectId } } = require('mongoose')
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
            publicKey, privateKey, refreshTokensUsed: [], refreshToken
        }, options = { upsert: true, new: true }

        const tokens = await keytokenModel.findOneAndUpdate(filter, update, options )
        return tokens ? tokens.publicKey : null

        }catch(error){
            return(error)
        }
    }


    static findByUserId = async (userId) => {
        return await keytokenModel.findOne({ user: new ObjectId(userId) }).lean();
    }
    static removeKeyById = async (id) => {
        return await keytokenModel.deleteOne({ _id: new ObjectId(id) });
    }

// // Note:
// dành cho mấy bạn bị lỗi remove() của mongoose model thì: Theo ver mới của mongoose, remove() đã không còn nữa, nên mình phải dùng deleteOne() và truyền vào 1 filter nhé.
// đây là đoạn code của mình:
//     static removeTokenById = async ({ id }) => {
//         const result = await keyTokenModel.deleteOne({
//             _id:  new Types.ObjectId(id)
//         })
//         return result;
//     }

    // static findByUserId = async ( userId ) => {
    //     return await keytokenModel.findOne({user: Types.ObjectId(userId)}).lean()
    // }

    // static  removeKeyById = async (id) => {
    //     return await keytokenModel.remove(id)
    // }


}

module.exports = KeyTokenService