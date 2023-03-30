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

// Set up server for backend of app

app.listen(config.PORT, () => {
  logger.info(`App is running on port ${config.PORT}`);
});
