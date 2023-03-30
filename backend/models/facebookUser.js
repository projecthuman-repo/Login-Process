/**
 * @module facebookUser
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
 * @constructor facebookUser
 */
const facebookUserSchema = new mongoose.Schema({
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
  phoneNumber: {
    type: String,
    required: false, // needs to be initialized after facebook sign in
    unique: true,
    sparse: true, // allows multiple null values and avoids 'E11000 duplicate key error collection' error.
  },
});

// Add better validations for uniqueness
facebookUserSchema.plugin(uniqueValidator);

facebookUserSchema.set("toJSON", {
  // stringifies and renames _id to id, does not show __v
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const FacebookUser = mongoose.model("FacebookUser", facebookUserSchema);

module.exports = FacebookUser;
