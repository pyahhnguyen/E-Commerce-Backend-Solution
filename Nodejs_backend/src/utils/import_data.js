const AirQuality = require('../models/airQuality');
const FireAlert = require('../models/fireAlert');


class DataImporter {
  static async insertSampleData() {
    try {
      // Thêm mẫu dữ liệu cho chỉ số không khí
      const sampleAirQuality = new AirQuality({
        timestamp: new Date(),
        pm25: 10,
        pm10: 15,
        co2: 400,
        humidity: 50,
        temperature: 25,
      });

      await sampleAirQuality.save();

      // Thêm mẫu dữ liệu cho trạng thái cảnh báo cháy
      const sampleFireAlert = new FireAlert({
        timestamp: new Date(),
        location: 'Phòng khách',
        status: 'Bình thường',
      });

      await sampleFireAlert.save();

      console.log('Sample data inserted successfully.');
    } catch (error) {
      console.error('Error inserting sample data:', error);
    }
  }
}
 module.exports = DataImporter;



 