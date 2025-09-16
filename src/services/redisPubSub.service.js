'use strict'

const redis = require('redis');

class RedisPubSubService {
    constructor() {
        this.subscriber = null;
        this.publisher = null;
        this.isConnected = false;
        this.subscriptions = new Map();
        this.initializeClients();
    }

    async initializeClients() {
        try {
            // Create Redis clients with proper configuration
            const clientConfig = {
                socket: {
                    host: process.env.REDIS_HOST || 'localhost',
                    port: process.env.REDIS_PORT || 6379
                },
                password: process.env.REDIS_PASSWORD,
                database: 0
            };

            this.subscriber = redis.createClient(clientConfig);
            this.publisher = redis.createClient(clientConfig);

            // Set up error handlers
            this.subscriber.on('error', (err) => {
                console.error('Redis Subscriber Error:', err);
                this.isConnected = false;
            });

            this.publisher.on('error', (err) => {
                console.error('Redis Publisher Error:', err);
                this.isConnected = false;
            });

            // Set up connection handlers
            this.subscriber.on('connect', () => {
                console.log('Redis Subscriber Connected');
            });

            this.publisher.on('connect', () => {
                console.log('Redis Publisher Connected');
                this.isConnected = true;
            });

            this.subscriber.on('disconnect', () => {
                console.log('Redis Subscriber Disconnected');
                this.isConnected = false;
            });

            this.publisher.on('disconnect', () => {
                console.log('Redis Publisher Disconnected');
                this.isConnected = false;
            });

            // Connect clients
            await Promise.all([
                this.subscriber.connect(),
                this.publisher.connect()
            ]);

            console.log('Redis PubSub Service initialized successfully');
        } catch (error) {
            console.error('Failed to initialize Redis PubSub clients:', error);
            throw error;
        }
    }

    async ensureConnection() {
        if (!this.isConnected || !this.subscriber || !this.publisher) {
            await this.initializeClients();
        }
    }

    async publish(channel, message) {
        try {
            await this.ensureConnection();
            
            // Ensure message is a string
            const messageStr = typeof message === 'string' ? message : JSON.stringify(message);
            
            const result = await this.publisher.publish(channel, messageStr);
            console.log(`Published message to channel ${channel}:`, result);
            return result;
        } catch (error) {
            console.error('Error publishing message:', error);
            throw error;
        }
    }

    async subscribe(channel, callback) {
        try {
            await this.ensureConnection();

            // Store callback for this channel
            this.subscriptions.set(channel, callback);

            // Subscribe to channel
            await this.subscriber.subscribe(channel, (message, subscribedChannel) => {
                console.log(`Received message from channel ${subscribedChannel}:`, message);
                
                // Call the callback for this specific channel
                const channelCallback = this.subscriptions.get(subscribedChannel);
                if (channelCallback) {
                    try {
                        // Try to parse JSON message, fallback to string
                        let parsedMessage;
                        try {
                            parsedMessage = JSON.parse(message);
                        } catch {
                            parsedMessage = message;
                        }
                        
                        channelCallback(subscribedChannel, parsedMessage);
                    } catch (error) {
                        console.error('Error in subscription callback:', error);
                    }
                }
            });

            console.log(`Subscribed to channel: ${channel}`);
        } catch (error) {
            console.error('Error subscribing to channel:', error);
            throw error;
        }
    }

}

module.exports = new RedisPubSubService();