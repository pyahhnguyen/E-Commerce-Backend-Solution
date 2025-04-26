'use strict'

const { resolve } = require('path')
const redis = require('redis')
const {promisify} = require('util')
const { reservationInventory } = require('../models/repository/inventory.repo')
const redisClient = redis.createClient({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD
})

const pexpire =  promisify(redisClient.pexpire).bind(redisClient)
const setnxAsync = promisify(redisClient.setnx).bind(redisClient)

const acquireLock = async (product_id, quantity, cartId) => {
    const keyLock = `lock_v1_2024_${product_id}`
    const retry = 10
    const expireTime = 3000

    for (let i = 0; i < retry.length; i++) {
        const result = await setnxAsync(keyLock, expireTime)
        console.log('result::', result)
        if(result === 1){
            const isReversation = await reservationInventory({
                product_id,
                quantity,
                cartId
            })

            if(isReversation.modifiedCount){ 
                await pexpire(keyLock, expireTime)
                return keyLock

            }
            return null;

        }else{
            await new Promise((resolve) => setTimeout(resolve, 50))
        }
        
    }
}

const releaseLock = async (keyLock) => {
    const delAsyncKey = promisify(redisClient.del).bind(redisClient)
    return await delAsyncKey(keyLock)
}



module.export = {
    acquireLock,
    releaseLock
}