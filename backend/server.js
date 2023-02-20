const app = require("./app");
const config = require('./utils/config')
const logger = require('./utils/logger')

app.listen(config.PORT, () => {  // refactored PORT into utils/config for best practices
  logger.info(`App is running on port ${config.PORT}`);
});
