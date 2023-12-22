const mongoose = require("mongoose");
const config = require("../utils/config");
mongoose.set("strictQuery", false);

// Connection options (optional)
const dbOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// Connect to the test database
const connectToTestDatabase = async () => {
  try {
    await mongoose.connect(config.DATABASE_CONNECTION, dbOptions);
    console.log("Connected to the test database");
  } catch (error) {
    throw new Error(`Connecting to the test database: ${error}`);
  }
};

// Create a connection to the CrossPlatform database
const crossPlatformDatabase = mongoose.createConnection(
  config.DATABASE_CROSS_PLATFORM_CONNECTION,
  dbOptions
);

const connectToCrossPlatformDatabase = async () => {
  try {
    await crossPlatformDatabase.asPromise();
    console.log("Connected to the CrossPlatform database");
  } catch (error) {
    throw new Error(`Connecting to the CrossPlatform database: ${error}`);
  }
};

// Connect to all databases
const connectToDatabases = async () => {
  try {
    await connectToTestDatabase();
    await connectToCrossPlatformDatabase();
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  connectToDatabases,
  crossPlatformDatabase,
};
