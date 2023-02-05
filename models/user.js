const mongoose = require("mongoose");
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "A user must have a first name"],
    unique: false,  // was prev true
    trim: true,
  },

  lastName: {
    type: String,
    required: [true, "A user must have a last name"],
    unique: false,  // was prev true
    trim: true,
  },

  username: {
    type: String,
    required: [true, "A user must have a username"],
    unique: true,
    trim: true,
  },
  passwordHash: {
    type: String,
    required: true,
    unique: false,  // was prev true
  },

  email: {
    type: String,
    required: [true, "A user must have an email"],
    unique: true,
    trim: true,
  },

  phoneNumber: {
    type: String,
    required: [true, "A user must have a phone number"],
    unique: true,
  },
});

userSchema.plugin(uniqueValidator)

userSchema.set('toJSON', {  // stringifies and renames _id to id, does not show __v
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.passwordHash  // passwordHash should not be revealed
  }
})

const User = mongoose.model("User", userSchema);

module.exports = User;
