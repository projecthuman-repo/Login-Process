/**
 * @module app
 */

/**
 * @requires mongoose
 * @requires mongoose-unique-validator
 * @const mongoose
 * @const uniqueValidator
 */

const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

/**
 * @constructor app
 */

// Define the App schema
const appSchema = new mongoose.Schema({
  appId: {
    type: String,
    required: true,
    unique: true
  },
  appName: {
    type: String,
    required: true
  },
  addDescription: {
    type: String,
    required: true
  }
});

// Add better validations for uniqueness
appSchema.plugin(uniqueValidator);

appSchema.set("toJSON", {
  // stringifies and renames _id to id, does not show __v
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const App = mongoose.model("App", appSchema);

module.exports = App;
