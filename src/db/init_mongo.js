const mongoose = require('mongoose');


const Connect_String = process.env.MONGO_URI || 'mongodb://localhost:27017/shopDev';

class Database {
  constructor() {
    this.connect();
  }

  // Connect to the database
  async connect() {
    try {
      await mongoose.connect(Connect_String, {
        useNewUrlParser: true, 
        useUnifiedTopology: true
      });
      console.log("Connected to MongoDB!!");
    } catch (err) {
      console.error('Error connecting to MongoDB:', err.message);
    }
  }


  // Get instance
  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}


const instanceMongoDb = Database.getInstance();

module.exports = instanceMongoDb;


