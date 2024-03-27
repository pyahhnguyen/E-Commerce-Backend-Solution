<<<<<<< HEAD


=======
>>>>>>> main
const JWT = require('jsonwebtoken')
const asyncHandler = require('../helper/asyncHandler')
const { findByUserId } = require('../services/keytoken.service')
const {AuthFailureError, NotFoundError} = require('../core/error.response')

const  HEADER = {
    API_KEY :'x-api-key',
    CLIENT_ID : 'x-client-id',
    AUTHORIZATION : 'authorization',
<<<<<<< HEAD
=======
    REFRESH_TOKEN : 'x-refresh-token'
>>>>>>> main
}

const createTokenPair = async (payload, publicKey, privateKey ) => {
    try{
        //accessToken
        const accessToken = await JWT.sign(payload, publicKey, {
<<<<<<< HEAD
          
            expiresIn: '2 days'

        })

        const refreshToken = await JWT.sign(payload, privateKey, {
         
            expiresIn: '7 days'

        })

=======
            expiresIn: '2 days'

        })
        const refreshToken = await JWT.sign(payload, privateKey, {     
            expiresIn: '7 days'

        })
>>>>>>> main
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
<<<<<<< HEAD

=======
>>>>>>> main
    const userId = req.headers[HEADER.CLIENT_ID]
    if(!userId) throw new AuthFailureError('Invalid Request')

    //2 
    const keyStore = await findByUserId(userId)
    if(!keyStore) throw new NotFoundError('Not found Keystore')
    
<<<<<<< HEAD
    //3
    const accessToken = req.headers[HEADER.AUTHORIZATION]
    if(!accessToken) throw new AuthFailureError('Invalid Request')

=======
   //3
    if(req.headers[HEADER.REFRESH_TOKEN]) {
        try {
            const refreshToken = req.headers[HEADER.REFRESH_TOKEN]
            const decodeUser = JWT.verify(refreshToken, keyStore.privateKey)
            if( userId !== decodeUser.userId) throw new AuthFailureError('Invalid Request')
            req.keyStore = keyStore
            req.user = decodeUser
            req.refreshToken = refreshToken
            return next()
        } catch (error) {
            throw error
        }          
    }
    //3
    const accessToken = req.headers[HEADER.AUTHORIZATION]
    if(!accessToken) throw new AuthFailureError('Invalid Request')
>>>>>>> main
    try {
        const decodeUser = JWT.verify(accessToken, keyStore.publicKey)
        if( userId !== decodeUser.userId) throw new AuthFailureError('Invalid Request')
        req.keyStore = keyStore
<<<<<<< HEAD
=======
        req.user = decodeUser
>>>>>>> main
        return next()
    } catch (error) {
        throw error
    }          
<<<<<<< HEAD
})


=======
}   
)
// 
const verifyJWT = async (token, keySecret) => {
    return await JWT.verify(token, keySecret)
}
>>>>>>> main

module.exports = {
    createTokenPair,
    authentication,
<<<<<<< HEAD
=======
    verifyJWT
>>>>>>> main
}