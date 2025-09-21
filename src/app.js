const compression = require('compression');
const express = require('express');
const { default: helmet } = require('helmet');
const morgan = require('morgan');   
const app = express();
const bodyParser = require('body-parser');
const { corsMiddleware } = require('./middlewares/cors');
require("dotenv").config();

// init middlewares
app.use(morgan("dev")); // print request logs on console
app.use(helmet());      // secure express app by setting various HTTP headers
app.use(compression()); // compress all responses
app.use(corsMiddleware); // Enable CORS
app.use(express.json());
app.use(bodyParser.urlencoded({ // parse urlencoded bodies in the request
    extended: true  
}));    


// // test pub.sub redis
// require('./tests/inventory.test');
// const productTest = require('./tests/product.test');
// productTest.purchaseProduct('product:011', 10);

//
app.use(bodyParser.json());

// init MongoDb
require('./db/init_mongo');

// Health check endpoint for Docker
app.get('/health', (req, res) => {
    res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
    });
});

// init routes
app.use('', require('./routes'));


//handling error

app.use((req, res, next) => {
    const  error = new Error('Not found');
    error.status = 404;
    next(error)
})

// logger 
app.use((error, req, res, next) => {
    
    const status = error.status || 500
    const resMessage = `${error.status} - ${Date.now()}ms - response: ${JSON.stringify(error)}`
    console.error(resMessage, [
        req.path,
        { requestId: req.requestId },
        {
            message: error.message
        }
    ])

    return res.status(status).json({
    
        status: status,
        stack: error.stack,
        message: error.message || 'Internal Server Error'
    })
})


module.exports = app;
