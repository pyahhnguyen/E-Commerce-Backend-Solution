const mongoose = require('mongoose');

class Database {
  constructor() {
    this.connect();
  }

  // Test if a MongoDB connection string is accessible
  async testConnection(connectionString, timeout = 5000) {
    try {
      const connection = await mongoose.createConnection(connectionString, {
        useNewUrlParser: true, 
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: timeout,
        connectTimeoutMS: timeout
      });
      await connection.close();
      return true;
    } catch (err) {
      console.log(`Connection test failed for ${connectionString.replace(/\/\/[^@]+@/, '//***:***@')}: ${err.message}`);
      return false;
    }
  }

  // Connect to the database with fallback logic
  async connect() {
    const atlasUri = process.env.ATLAS_URI;
    const localUri = process.env.MONGO_URI || 'mongodb://mongodb:27017/shopDev';
    const timeout = parseInt(process.env.DB_CONNECTION_TIMEOUT) || 5000;
    
    let connectionString = localUri;
    let connectionType = 'Local MongoDB';

    // Try Atlas first if provided
    if (atlasUri) {
      console.log('Testing Atlas connection...');
      const atlasAccessible = await this.testConnection(atlasUri, timeout);
      
      if (atlasAccessible) {
        connectionString = atlasUri;
        connectionType = 'MongoDB Atlas';
      } else {
        console.log('Atlas connection failed, falling back to local MongoDB...');
      }
    } else {
      console.log('No Atlas URI provided, using local MongoDB...');
    }

    try {
      await mongoose.connect(connectionString, {
        useNewUrlParser: true, 
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: timeout,
        connectTimeoutMS: timeout
      });
      console.log(`Connected to ${connectionType}!!`);
      console.log(`Database: ${mongoose.connection.db.databaseName}`);
    } catch (err) {
      console.error(`Error connecting to ${connectionType}:`, err.message);
      
      // If Atlas failed and we haven't tried local yet, try local as last resort
      if (connectionString === atlasUri && connectionString !== localUri) {
        console.log('Attempting final fallback to local MongoDB...');
        try {
          await mongoose.connect(localUri, {
            useNewUrlParser: true, 
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: timeout,
            connectTimeoutMS: timeout
          });
          console.log('Connected to Local MongoDB as fallback!!');
        } catch (fallbackErr) {
          console.error('All database connection attempts failed:', fallbackErr.message);
          process.exit(1);
        }
      } else {
        console.error('Database connection failed. Exiting...');
        process.exit(1);
      }
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


