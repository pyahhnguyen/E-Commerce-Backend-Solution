const express = require('express');
const router = express.Router();

const FireAlert = require('../models/fireAlert');
const AirQuality = require('../models/airQuality');


// Root route
router.get('/', (req, res) => {
    return res.status(200).json({ 
      message: "Welcome to the lesson",
    });
  });
  
  // API để lấy tất cả dữ liệu chỉ số không khí
  router.get('/api/airqualities', async (req, res) => {
    try {
      const airQualities = await AirQuality.find();
      res.json(airQualities);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Đã xảy ra lỗi khi lấy dữ liệu chỉ số không khí từ MongoDB' });
    }
  });
  
  // API để lấy tất cả dữ liệu cảnh báo cháy
  router.get('/api/firealerts', async (req, res) => {
    try {
      const fireAlerts = await FireAlert.find();
      res.json(fireAlerts);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Đã xảy ra lỗi khi lấy dữ liệu cảnh báo cháy từ MongoDB' });
    }
  });

module.exports = router;