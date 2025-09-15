const Redis = require('redis');

class RedisPubSubService {

    constructor(){
        // initialize Redis clients
        this.subscriber = Redis.createClient();
        this.publisher = Redis.createClient();

        // handle errors
        this.subscriber.on('error', (err) => console.error('Redis Subscriber Error', err));
        this.publisher.on('error', (err) => console.error('Redis Publisher Error', err));

        // connect Redis clients
        this.subscriber.connect().catch(console.error);
        this.publisher.connect().catch(console.error);
    }


    publish(channel, message) {
        return new Promise((resolve, reject) => {
            this.publisher.publish(channel, message, (err, reply) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(reply)
                }
            })
        })
    }


    subscribe(channel, callback) {
        this.subscriber.subscribe(channel)
        this.subscriber.on('message', (subcriberChannel, message) => {
            if (channel === subcriberChannel) {
                callback(channel, message)
            }
        })
    }
}



module.exports = new RedisPubSubService()