'use strict'

const redis = require('redis')
const { reservationInventory } = require('../models/repository/inventory.repo')

class RedisService {
    constructor() {
        this.client = null;
        this.isConnected = false;
        this.connectRedis();
    }

    async connectRedis() {
        try {
            this.client = redis.createClient({
                socket: {
                    host: process.env.REDIS_HOST || 'localhost',
                    port: process.env.REDIS_PORT || 6379
                },
                password: process.env.REDIS_PASSWORD,
                database: 0
            });

            this.client.on('error', (err) => {
                console.error('Redis Client Error:', err);
                this.isConnected = false;
            });

            this.client.on('connect', () => {
                console.log('Redis Client Connected');
                this.isConnected = true;
            });

            this.client.on('disconnect', () => {
                console.log('Redis Client Disconnected');
                this.isConnected = false;
            });

            await this.client.connect();
        } catch (error) {
            console.error('Failed to connect to Redis:', error);
            throw error;
        }
    }

    async ensureConnection() {
        if (!this.isConnected || !this.client) {
            await this.connectRedis();
        }
    }

    async acquireLock(product_id, quantity, cartId) {
        await this.ensureConnection();
        
        const keyLock = `lock_v1_2024_${product_id}`;
        const retry = 10;
        const expireTime = 3000; // 3 seconds

        for (let i = 0; i < retry; i++) {
            try {
                // Use SET with NX and PX options (Redis 2.6.12+)
                const result = await this.client.set(keyLock, 'locked', {
                    NX: true,
                    PX: expireTime
                });

                console.log('Lock result::', result);
                
                if (result === 'OK') {
                    // Try to reserve inventory
                    const isReservation = await reservationInventory({
                        product_id,
                        quantity,
                        cartId
                    });

                    if (isReservation.modifiedCount) {
                        return keyLock;
                    } else {
                        // Release lock if reservation failed
                        await this.releaseLock(keyLock);
                        return null;
                    }
                } else {
                    // Wait before retry
                    await new Promise((resolve) => setTimeout(resolve, 50));
                }
            } catch (error) {
                console.error('Error acquiring lock:', error);
                await new Promise((resolve) => setTimeout(resolve, 50));
            }
        }
        
        return null; // Failed to acquire lock after all retries
    }

    async releaseLock(keyLock) {
        try {
            await this.ensureConnection();
            return await this.client.del(keyLock);
        } catch (error) {
            console.error('Error releasing lock:', error);
            return 0;
        }
    }

}

// Create singleton instance
const redisService = new RedisService();

module.exports = {
    redisService,
    acquireLock: (product_id, quantity, cartId) => redisService.acquireLock(product_id, quantity, cartId),
    releaseLock: (keyLock) => redisService.releaseLock(keyLock)
}