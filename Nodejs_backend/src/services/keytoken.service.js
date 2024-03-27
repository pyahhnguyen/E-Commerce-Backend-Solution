
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
<<<<<<< HEAD

=======
>>>>>>> main
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
<<<<<<< HEAD
        return await keytokenModel.findOne({ user: new ObjectId(userId) }).lean();
=======
        return await keytokenModel.findOne({ user: new ObjectId(userId) });
>>>>>>> main
    }
    static removeKeyById = async (id) => {
        return await keytokenModel.deleteOne({ _id: new ObjectId(id) });
    }

<<<<<<< HEAD
// // Note:
=======
    static findByRefreshTokenUsed = async (refreshToken) => {
        return await keytokenModel.findOne({ refreshTokensUsed: refreshToken }).lean();

    }
    static findByRefreshToken = async (refreshToken) => {
        return await keytokenModel.findOne({ refreshToken})   
    }

    static deleteKeyByUserId = async (userId) => {
        return await keytokenModel.deleteOne({ user: userId })
    }


// Note:
>>>>>>> main
// dành cho mấy bạn bị lỗi remove() của mongoose model thì: Theo ver mới của mongoose, remove() đã không còn nữa, nên mình phải dùng deleteOne() và truyền vào 1 filter nhé.
// đây là đoạn code của mình:
//     static removeTokenById = async ({ id }) => {
//         const result = await keyTokenModel.deleteOne({
//             _id:  new Types.ObjectId(id)
//         })
//         return result;
//     }
<<<<<<< HEAD

=======
>>>>>>> main
    // static findByUserId = async ( userId ) => {
    //     return await keytokenModel.findOne({user: Types.ObjectId(userId)}).lean()
    // }

    // static  removeKeyById = async (id) => {
    //     return await keytokenModel.remove(id)
    // }
<<<<<<< HEAD


=======
>>>>>>> main
}

module.exports = KeyTokenService