const Redis = require('redis');

class RedisPubSubService {

    constructor(){
        this.subcriber = Redis.createClient();
        this.publisher = Redis.createClient();
    }

    publish(channel, message){
        return new Promise((resolve, reject) => {
            this.publisher.publish(channel, message, (err, reply) => {
                if(err) reject(err)
                resolve(reply)
            })
        })
    }

    subscribe(channel, callback){
        this.subcriber.subscribe(channel);
        this.subcriber.on('message', (subcriberChannel, message) => {
            if(channel === subcriberChannel){
                callback(channel, message)
            }   
        })
    }

}

module.exports = new RedisPubSubService()