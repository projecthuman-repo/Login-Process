/**
 * @module userApp
 */

/**
 * @requires mongoose
 * @requires crypto
 * @requires mongoose-unique-validator
 * @const crypto
 * @const mongoose
 * @const uniqueValidator
 */

const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

/**
 * @constructor userApp
 */

// Define the UserApp schema
const userAppSchema = new mongoose.Schema({
    // UserApp schema fields and their types
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', required: true },
    app: { type: mongoose.Schema.Types.ObjectId, 
        ref: 'App', 
        required: true },
    appVersion: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'App Version', 
        required: true },
    lastActivityDate: { 
        type: Date },
    totalActivityTime: { 
        type: Number },
    appRank: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Rank' },
  });

  // Add better validations for uniqueness
userAppSchema.plugin(uniqueValidator);

userAppSchema.set("toJSON", {
    // stringifies and renames _id to id, does not show __v
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString();
      delete returnedObject._id;
      delete returnedObject.__v;
    },
  });

  const UserApp = mongoose.model("UserApp", userAppSchema);

module.exports = UserApp;
