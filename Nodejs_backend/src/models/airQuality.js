const mongoose = require('mongoose');

const airQualitySchema = new mongoose.Schema({
  timestamp: Date,
  pm25: Number,
  pm10: Number,
  co2: Number,
  humidity: Number,
  temperature: Number,
});

const AirQuality = mongoose.model('AirQuality', airQualitySchema);

module.exports = AirQuality;
