const dev = {
    app: {
        port: process.env.DEV_APP_PORT || 3052
    },  
    db: {
        host: process.env.DEV_DB_HOST || 'localhost',
        port: process.env.DEV_DB_PORT || 27017,
        name: process.env.DEV_DB_NAME || 'app_dev'
    }

}

const production = {
    app:{
        port: process.env.PROD_APP_PORT || 3050
    },
    db:{
        host: process.env.PROD_DB_HOST || 'localhost',
        port: process.env.PROD_DB_PORT || 27017,
        name: process.env.PROD_DB_NAME || 'app_prod'
    }
    }

 
const config = {dev, production}
const env = process.env.NODE_ENV || 'dev';
module.exports = config[env];
    
