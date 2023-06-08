/**
 * @module userRank
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
 * @constructor userRank
 */
// Define the UserRank schema
const userRankSchema = new mongoose.Schema({
    userRankID: { 
        type: String, 
        required: true,
         unique: true },
    user: { 
        type: mongoose.Schema.Types.ObjectId,
         ref: 'User', required: true },
    rank: { 
        type: mongoose.Schema.Types.ObjectId,
         ref: 'Rank', required: true },
    app: { 
        type: mongoose.Schema.Types.ObjectId,
         ref: 'App',
         required: true },
    dateAchieved: { 
        type: Date,
         required: true },
    isActive: { 
        type: Boolean,
         default: false },
  });

    // Add better validations for uniqueness
userRankSchema.plugin(uniqueValidator);

userRankSchema.set("toJSON", {
    // stringifies and renames _id to id, does not show __v
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString();
      delete returnedObject._id;
      delete returnedObject.__v;
    },
  });

const UserRank = mongoose.model("UserRank", userRankSchema);

module.exports = UserRank;