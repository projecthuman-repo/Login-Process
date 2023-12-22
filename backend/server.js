/**
 * @module server
 *
 */

/**
 * @const app
 * @const app
 * @const logger
 */

const app = require("./app");
const config = require("./utils/config");
const logger = require("./utils/logger");
const { connectToDatabases } = require("./db/connection");

// Set up server for backend of app
connectToDatabases()
  .then(() => {
    app.listen(config.PORT, () => {
      logger.info(`App is running on port ${config.PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
