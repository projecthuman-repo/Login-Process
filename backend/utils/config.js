/**
 * @module config
 * @requires dotenv.config
 * 
 */
require("dotenv").config({ path: "./config.env" });

/**
 * @const PORT port backend will run on
 * @const DATABASE_CONNECTION url for database connection
 */
const PORT = process.env.PORT
const DATABASE_CONNECTION = process.env.DATABASE_CONNECTION  
const DATABASE_CROSS_PLATFORM_CONNECTION = process.env.DATABASE_CROSS_PLATFORM_CONNECTION  

module.exports = {
  PORT,
  DATABASE_CONNECTION,
  DATABASE_CROSS_PLATFORM_CONNECTION
}