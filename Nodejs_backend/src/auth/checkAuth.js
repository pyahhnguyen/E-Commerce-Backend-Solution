'use strict'

const  HEADER = {
    API_KEY :'x-api-key',
    AUTHORIZATION : 'authorization',
}

const { findById } = require("../services/apikey.service")

const apikey = async (req, res, next) => {

    try {
        const key = req.headers[HEADER.API_KEY]?.toString()
        if(!key){
            return res.status(403).json({
                message: "Forbidden  Error"
            })
        }

        //check objectKey
        const objKey = await findById(key)
        if(!objKey){
            return res.status(403).json({      
                message: "Forbidden  Error"
            })
        }

        //use require objKey to check permission
        req.objKey = objKey
        return next()


    }
    catch (error) {
    }
}


// check permission for apikey
const permission = (permission) =>{
    return (req, res, next) => {
        if(!req.objKey.permissions){
            return res.status(403).json({
                message: "Permission denied"
            })
        }

        console.log('permissiom::', req.objKey.permissions)
        const validPermission = req.objKey.permissions.includes(permission)
        if(!validPermission){
            return res.status(403).json({
                message: "Permission denied"
            })
        }
        
        return next()
     
    }
}



module.exports = {
    apikey,
    permission,
   
}