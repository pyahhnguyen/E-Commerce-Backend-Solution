const compression = require('compression');
const express = require('express');
const { default: helmet } = require('helmet');
const morgan = require('morgan');   
const app = express();
const bodyParser = require('body-parser');
require("dotenv").config();

// init middlewares
app.use(morgan("dev")); // print request logs on console
app.use(helmet());      // secure express app by setting various HTTP headers
app.use(compression()); // compress all responses
app.use(express.json());
app.use(bodyParser.urlencoded({ // parse urlencoded bodies in the request
    extended: true  
}));


// test pub.sub redis
require('./tests/inventory.test');
const productTest = require('./tests/product.test');
productTest.purchaseProduct('product:011', 10);

//
app.use(bodyParser.json());

// init MongoDb
require('./db/init_mongo');

// init routes
app.use('', require('./routes'));


//handling error

app.use((req, res, next) => {
    const  error = new Error('Not found');
    error.status = 404;
    next(error)
})

app.use((error, req, res, next) => {
    const statusCode = error.status || 500;
    return res.status(statusCode).json({
        status: 'error',
        code: statusCode,
        stack: error.stack,
        message: error.message || 'Internal Server Error'
    })

}

)

module.exports = app;
