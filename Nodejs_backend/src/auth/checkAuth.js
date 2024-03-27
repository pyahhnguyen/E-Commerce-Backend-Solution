'use strict'
<<<<<<< HEAD

const  HEADER = {
    API_KEY :'x-api-key',
=======
// viet constant de de sua chua , chir can suaw cho nay 
const  HEADER = {
    API_KEY :'x-api-key',   
>>>>>>> main
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
<<<<<<< HEAD

=======
>>>>>>> main
        //check objectKey
        const objKey = await findById(key)
        if(!objKey){
            return res.status(403).json({      
                message: "Forbidden  Error"
            })
        }
<<<<<<< HEAD

        //use require objKey to check permission
        req.objKey = objKey
        return next()


=======
        //use require objKey to check permission
        req.objKey = objKey
        return next()
>>>>>>> main
    }
    catch (error) {
    }
}

<<<<<<< HEAD

=======
>>>>>>> main
// check permission for apikey
const permission = (permission) =>{
    return (req, res, next) => {
        if(!req.objKey.permissions){
            return res.status(403).json({
                message: "Permission denied"
<<<<<<< HEAD
            })
        }

        console.log('permissiom::', req.objKey.permissions)
=======
                
            })
        }
        console.log("Permission:::: ", req.objKey.permissions)
>>>>>>> main
        const validPermission = req.objKey.permissions.includes(permission)
        if(!validPermission){
            return res.status(403).json({
                message: "Permission denied"
            })
        }
<<<<<<< HEAD
        
=======
    
>>>>>>> main
        return next()
     
    }
}

<<<<<<< HEAD


=======
>>>>>>> main
module.exports = {
    apikey,
    permission,
   
}