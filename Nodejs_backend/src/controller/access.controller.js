'use strict'

const AccessService = require("../services/access.service")
const { Ok, Created, SuccessResponse} = require('../core/success.response')

class AccessController {
    
    login = async(req, res, next) => {
      new SuccessResponse({
        metadata: await AccessService.login(req.body)
      }).send(res)
    }

    logout = async(req, res, next) => {
      new SuccessResponse({
        message: 'Logout OK!',
        metadata: await AccessService.logout(req.keyStore)
      }).send(res)
    }

  
    signUp = async(req, res, next ) => {
      new Created({
        message: 'Resgister OK!',
        metadata:  await AccessService.signUp(req.body)
      }).send(res)s

        // return res.status(201).json(await AccessService.signUp(req.body))
     }

}


module.exports = new AccessController();

