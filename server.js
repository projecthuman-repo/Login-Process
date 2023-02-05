const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = require("./app");
dotenv.config({ path: "./config.env" });
const User = require("./models/user");

const DB = process.env.DATABASE_CONNECTION;
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
testUser.save();

const port = process.env.port || 3000;

app.listen(port, () => {
  console.log("App is running on port", port);
});
