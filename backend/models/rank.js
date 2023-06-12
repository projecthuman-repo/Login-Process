/**
 * @module rank
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
 * @constructor rank
 */

// Define the Rank schema
const rankSchema = new mongoose.Schema({
  rankId: {
    type: String,
    required: true,
    unique: true,
  },
  rankName: {
    type: String,
    required: true,
  },
  rankDescription: {
    type: String,
    required: true,
  },
  rankPoints: {
    type: Number,
    required: true,
  },
});

// Add better validations for uniqueness
rankSchema.plugin(uniqueValidator);

rankSchema.set("toJSON", {
  // stringifies and renames _id to id, does not show __v
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Rank = mongoose.model("Rank", rankSchema);

module.exports = Rank;
