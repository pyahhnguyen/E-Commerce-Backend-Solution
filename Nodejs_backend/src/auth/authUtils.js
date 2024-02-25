

const JWT = require('jsonwebtoken')
const asyncHandler = require('../helper/asyncHandler')
const { findByUserId } = require('../services/keytoken.service')
const {AuthFailureError, NotFoundError} = require('../core/error.response')

const  HEADER = {
    API_KEY :'x-api-key',
    CLIENT_ID : 'x-client-id',
    AUTHORIZATION : 'authorization',
}

const createTokenPair = async (payload, publicKey, privateKey ) => {
    try{
        //accessToken
        const accessToken = await JWT.sign(payload, publicKey, {
          
            expiresIn: '2 days'

        })

        const refreshToken = await JWT.sign(payload, privateKey, {
         
            expiresIn: '7 days'

        })

        JWT.verify( accessToken, publicKey, (err, decode) => {
            if(err){
                console.error('error verify ::', err)
            }else{
                console.log('decode verify :::', decode)    
            }
        })

        return {accessToken, refreshToken}

    }catch(error){

    }
}

const authentication  = asyncHandler(async (req, res, next) => {
    
    /*
    1- check userId missing?
    2- get accessToken 
    3- verify accessToken
    4- check user in dbs
    5- check keystore with userId 
    6- return next
    */

    const userId = req.headers[HEADER.CLIENT_ID]
    if(!userId) throw new AuthFailureError('Invalid Request')

    //2 
    const keyStore = await findByUserId(userId)
    if(!keyStore) throw new NotFoundError('Not found Keystore')
    
    //3
    const accessToken = req.headers[HEADER.AUTHORIZATION]
    if(!accessToken) throw new AuthFailureError('Invalid Request')

    try {
        const decode = JWT.verify(accessToken, keyStore.publicKey)
        if( userId !== decode.userId) throw new AuthFailureError('Invalid Request')
        req.keyStore = keyStore
        return next()
    } catch (error) {
        throw error
    }          
})

module.exports = {
    createTokenPair,
    authentication,
}