/**
 * @module activity
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
 * @constructor activity
 */

// Define the Activity schema
const activitySchema = new mongoose.Schema({
  activityId: {
    type: String,
    required: true,
    unique: true
  },
  activityName: {
    type: String,
    required: true
  },
  activityDescription: {
    type: String,
    required: true
  },
  activityPoints: {
    type: Number,
    required: true
  },
  appId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "App",
    required: true
  }
});

// Add better validations for uniqueness
activitySchema.plugin(uniqueValidator);

activitySchema.set("toJSON", {
  // stringifies and renames _id to id, does not show __v
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Activity = mongoose.model("Activity", activitySchema);

module.exports = Activity;
