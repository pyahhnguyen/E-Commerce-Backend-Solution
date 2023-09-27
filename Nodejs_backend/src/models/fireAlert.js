const mongoose = require('mongoose');

const fireAlertSchema = new mongoose.Schema({
  timestamp: Date,
  location: String,
  status: String,
  // Thêm các trường dữ liệu khác cần thiết
});

const FireAlert = mongoose.model('FireAlert', fireAlertSchema);

module.exports = FireAlert;
