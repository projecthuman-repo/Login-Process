const mongoose = require("mongoose");
const app = require("./app");
const config = require('./utils/config')
const logger = require('./utils/logger')
const User = require("./models/user");

/* const DB = process.env.DATABASE_CONNECTION;
mongoose.set("strictQuery", false);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Db connection was successful");
  })
  .catch((err) => {
    console.log(err);
  });
const testUser = new User({
  firstName: "firstnamee",
  lastName: "lastnamee",
  username: "usernamee",
  passwordHash: "passwordhashe",
  email: "emaile",
  phoneNumber: "phonenumbere",
});
testUser.save(); */

app.listen(config.PORT, () => {  // refactored PORT into utils/config for best practices
  logger.info(`App is running on port ${config.PORT}`);
});
