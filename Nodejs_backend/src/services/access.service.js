const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const KeyTokenService = require("./keytoken.service");
const { createTokenPair } = require("../auth/authUtils");
const { getInfoData } = require("../utils");



const RoleShop = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};
class AccessService {
  static signUp = async ({ name, email, password }) => {
    try {
      // step1: check mail existed?

      const holderShop = await shopModel.findOne({ email }).lean();
      if (holderShop) {
        return {
          code: "xxxx",
          message: "Shop already existed",
        };
      }
      const passwordHash = await bcrypt.hash(password, 10);
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



      const privateKey = crypto.randomBytes(64).toString('hex')
      const publicKey = crypto.randomBytes(64).toString('hex')

        
        console.log({ privateKey, publicKey }); // save collection KeyStore


        const keyStore = await KeyTokenService.createKeyToken({
          userId: newShop._id,
          publicKey,
          privateKey
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
        
        console.log("Created Tooken Success::", tokens);


// filter data response uding lodash
        return {
          code: 201,
          metadata: {
            shop: getInfoData( {fileds: ['_id', 'name', 'email'], object: newShop }),
            tokens,
          }
        }
      }

      return {
        code: 200,
        metadata: {
          shop: newShop,
          tokens,
        },
      };
    } catch (error) {
      console.log("error::", error);
      return {
        code: "xxx",
        message: error.message,
        status: "error",
      };
    }
  };
}

module.exports = AccessService;