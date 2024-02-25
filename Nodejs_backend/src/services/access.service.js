const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const KeyTokenService = require("./keytoken.service");
const { createTokenPair } = require("../auth/authUtils");
const { getInfoData } = require("../utils");
const { BadRequestError, ConflictRequestError } = require("../core/error.response");

// service ///
const {findByEmail} = require('./shop.service')


const RoleShop = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};

class AccessService {

  // service logout
  static logout = async( {keyStore }) => {
    const  delKey = await KeyTokenService.removeKeyById(keyStore._id)
    console.log('delKey :::', delKey)
    return delKey
  }


  /*
  1- check eamil in dbs
  2- match password
  3- create key pair ( access token, refresh token)
  4- generate tokens
  5- get data return login 
*/

  // service login

  static login = aysnc ({ email, password, refreshToken = null }) => {
    // 1
    const foundShop = await findByEmail({ email });
    if (!foundShop) throw new BadRequestError("Error: Shop not registered !");
    // 2
    const match = bcrypt.compare(password, foundShop.password);
    if (!match) throw new AuthFailureError("Authentication error");

    // 3
    const privateKey = crypto.randomBytes(64).toString("hex");
    const publicKey = crypto.randomBytes(64).toString("hex");
    // 4
    const {_id: userId } = foundShop;
    const tokens = await createTokenPair(
      { userId, email },
      publicKey,
      privateKey
    )

    await KeyTokenService.createKeyToken({
      refreshToken: tokens.refreshToken,
      publicKey,
      privateKey,
      userId
    })
    return {
      shop: getInfoData({
        fileds: ["_id", "name", "email"],
        object: foundShop,
      }),
      tokens
    };
  };


  // service signup
  static signUp = async ({ name, email, password }) => {
    // step1: check mail existed?
    const holderShop = await shopModel.findOne({ email }).lean();
    if (holderShop) {
      throw new BadRequestError("Error: Shop already registered !");
    }
    const passwordHash = await bcrypt.hash(password, 10);
    // Hash password for security evetns 
    const newShop = await shopModel.create({
      name,
      email,
      password: passwordHash,
      roles: [RoleShop.SHOP],
    });

    // step2: create key pair
    if (newShop) {
      //   // created privateKey , publicKey
      //   const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
      //     modulusLength: 4096,
      //     publicKeyEncoding: {
      //       type: "pkcs1",
      //       format: "pem",
      //     },
      //     privateKeyEncoding: {
      //       type: "pkcs1",
      //       format: "pem",
      //     },
      //   });

      const privateKey = crypto.randomBytes(64).toString("hex");
      const publicKey = crypto.randomBytes(64).toString("hex");

      console.log({ privateKey, publicKey }); // save collection KeyStore
      const keyStore = await KeyTokenService.createKeyToken({
        userId: newShop._id,
        publicKey,
        privateKey,
      });

      if (!keyStore) {
        return {
          code: "xxxx",
          message: "keyStore error",
        };
      }

      //create token pair
      const tokens = await createTokenPair(
        { userId: newShop._id, email },
        publicKey,
        privateKey
      );
      // filter data response uding lodash
      return {
        // code: 201,
        // metadata: {
        shop: getInfoData({
          fileds: ["_id", "name", "email"],
          object: newShop,
        }),
        tokens,
        // }
      };
    }

    return {
      code: 200,
      metadata: null,
    };
  };
}

module.exports = AccessService;
