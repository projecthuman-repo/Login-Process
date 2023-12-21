const mongoose = require("mongoose");
const config = require("../utils/config");
const logger = require("../utils/logger");
mongoose.set("strictQuery", false);

logger.info("connecting to default", config.DATABASE_CONNECTION);
logger.info("connecting to CrossPlatform", config.DATABASE_CONNECTION);

// Connection options (optional)
const dbOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// Connect to the default database using mongoose.connect
mongoose
  .connect(config.DATABASE_CONNECTION, dbOptions)
  .then(() => {
    logger.info("Connected to the default database");
  })
  .catch((err) => {
    logger.info("error connecting to the default database:", err.message);
  });

// Create a connection to the CrossPlatform database using createConnection
const crossPlatformDbConnection = mongoose.createConnection(
  config.DATABASE_CROSS_PLATFORM_CONNECTION,
  dbOptions
);

// Connection event handlers for the CrossPlatform database
crossPlatformDbConnection
  .on("connected", () => {
    console.log("Connected to the CrossPlatform database");
  })
  .on("error", (error) => {
    console.error("Error connecting to the CrossPlatform database:", error);
  });

// Export the connections for external use
module.exports = {
  defaultDBConnection: mongoose.connection,
  crossPlatformDbConnection,
};
