require("dotenv").config({ path: "./config.env" });

const PORT = process.env.PORT
const DATABASE_CONNECTION = process.env.DATABASE_CONNECTION  

module.exports = {
  PORT,
  DATABASE_CONNECTION
}