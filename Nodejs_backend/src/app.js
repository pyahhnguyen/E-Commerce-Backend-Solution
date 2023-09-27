const compression = require('compression');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const app = express();

// init middlewares
app.use(morgan("dev")); // print request logs on console
app.use(helmet());      // secure express app by setting various HTTP headers
app.use(compression()); // compress all responses

// init MongoDb
require('./db/init_mongo');


//init routes

app.use('', require('./routes'));
// // Import models
// const FireAlert = require('./models/fireAlert');
// const AirQuality = require('./models/airQuality');






module.exports = app;
