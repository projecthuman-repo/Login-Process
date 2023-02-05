const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "A user must have a first name"],
    unique: true,
    trim: true,
  },

  lastName: {
    type: String,
    required: [true, "A user must have a last name"],
    unique: true,
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
    unique: true,
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

const User = mongoose.model("User", userSchema);

module.exports = User;
