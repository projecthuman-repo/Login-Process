/**
 * @module userActivity
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
const crypto = require("crypto");
const uniqueValidator = require("mongoose-unique-validator");

/**
 * @constructor userActivity
 */

// Define the UserActivity schema
const userActivitySchema = new mongoose.Schema({
    userActivityID: {
         type: String,
          required: true,
           unique: true },
    user: {
         type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
           required: true },
    activity: { 
        type: mongoose.Schema.Types.ObjectId,
         ref: 'Activity',
          required: true },
    datePerformed: {
         type: Date,
          required: true },
    pointsEarned: { 
        type: Number, 
        required: true },
  });

    // Add better validations for uniqueness
userActivitySchema.plugin(uniqueValidator);

userActivitySchema.set("toJSON", {
    // stringifies and renames _id to id, does not show __v
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString();
      delete returnedObject._id;
      delete returnedObject.__v;
    },
  });

const UserActivity = mongoose.model("UserActivity", userActivitySchema);

module.exports = UserActivity;