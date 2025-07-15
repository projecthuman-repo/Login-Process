import mongoose, { Connection } from 'mongoose';
import config from '../utils/config';
import { MongoMemoryServer } from 'mongodb-memory-server';

mongoose.set('strictQuery', false);

// No options needed in Mongoose 7+
const dbOptions = {}; 

// Use in-memory MongoDB for testing
const connectToTestDatabase = async (): Promise<void> => {
  try {
    // ============================
    // 🚨 Test Mode: In-Memory MongoDB
    // ============================
    const mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    await mongoose.connect(uri);
    console.log('Connected to in-memory MongoDB (Test)');

    // ============================
    // ✅ To use real MongoDB later:
    // ============================
    // await mongoose.connect(config.DATABASE_CONNECTION);
    // console.log('Connected to the test database');
  } catch (error: any) {
    throw new Error(`Connecting to test database failed: ${error.message}`);
  }
};

// Create CrossPlatform connection
// ============================
// 🚨 Test Mode: Skipping CrossPlatform DB
// ============================
const crossPlatformDatabase = {} as Connection; // placeholder for testing

const connectToCrossPlatformDatabase = async (): Promise<void> => {
  try {
    console.log('Skipping CrossPlatform DB connection (Test mode)');

    // ============================
    // ✅ To use real CrossPlatform DB later:
    // ============================
    // const crossPlatformDatabase: Connection = mongoose.createConnection(
    //   config.DATABASE_CROSS_PLATFORM_CONNECTION
    // );
    // await crossPlatformDatabase.asPromise();
    // console.log('Connected to the CrossPlatform database');
  } catch (error: any) {
    throw new Error(`Connecting to CrossPlatform database failed: ${error.message}`);
  }
};

// Connect to all databases
const connectToDatabases = async (): Promise<void> => {
  try {
    await connectToTestDatabase();
    await connectToCrossPlatformDatabase();
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export {
  connectToDatabases,
  crossPlatformDatabase
};
