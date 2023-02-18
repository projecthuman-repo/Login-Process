const mongoose = require("mongoose");
const crypto = require("crypto");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "A user must have a first name"],
    unique: false, // was prev true
    trim: true,
  },

  lastName: {
    type: String,
    required: [true, "A user must have a last name"],
    unique: false, // was prev true
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
    unique: false, // was prev true
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

  passwordResetToken: String,
  passwordResetExpires: Date,

  passwordChangedAt: Date,
});

userSchema.plugin(uniqueValidator);

userSchema.set("toJSON", {
  // stringifies and renames _id to id, does not show __v
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.passwordHash; // passwordHash should not be revealed
  },
});

userSchema.methods.changedPasswordAfter = function (jwtTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = this.passwordChangedAt.getTime() / 1000;
    if (changedTimestamp > jwtTimestamp) return true;
  }
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpires = Date.now() + 600000; //add 10 min to current time
  return resetToken;
};
const User = mongoose.model("User", userSchema);

module.exports = User;
