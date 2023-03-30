/**
 * @module googleUser
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
 * @constructor googleUser
 */
const googleUserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "A user must have a first name"],
    unique: false,
  },
  lastName: {
    type: String,
    required: [true, "A user must have a last name"],
    unique: false,
  },
  email: {
    type: String,
    required: [true, "A user must have an email"],
    unique: true,
  },
});

// Add better validations for uniqueness
googleUserSchema.plugin(uniqueValidator);

googleUserSchema.set("toJSON", {
  // stringifies and renames _id to id, does not show __v
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const GoogleUser = mongoose.model("GoogleUser", googleUserSchema);

module.exports = GoogleUser;
