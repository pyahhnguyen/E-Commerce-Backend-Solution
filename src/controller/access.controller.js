'use strict'

const AccessService = require("../services/access.service")
const { Ok, Created, SuccessResponse} = require('../core/success.response')

class AccessController {

  handleRefreshToken = async(req, res, next) => {
    new SuccessResponse({
      message: 'Get a Refresh Token OK!',
      metadata: await AccessService.handleRefreshToken(
        {
          refreshToken: req.refreshToken,
          keyStore: req.keyStore,
          user: req.user
        }
      )
    }).send(res)
  }

    
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
        metadata:  await AccessService.signUp(req.body),
        options:{
          limit: 10
        }
      }).send(res)
        // return res.status(201).json(await AccessService.signUp(req.body))
    
  }

}


module.exports = new AccessController();

