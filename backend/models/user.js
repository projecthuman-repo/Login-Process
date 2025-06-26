/**
 * @module user
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
const { isEmail } = require('validator');


/**
 * @constructor user
 */
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "A user must have a first name"],
  },

  lastName: {
    type: String,
    required: [true, "A user must have a last name"],
  },

  username: {
    type: String,
    required: [true, "A user must have a username"],
    unique: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    lowercase: true,
    unique: true,
    required: [true, "A user must have an email"],
    index: true,
    validate: [isEmail, 'invalid email'],
  },

  phoneNumber: {
    type: String,
    required: [true, "A user must have a phone number"],
    unique: true,
  },

  picture: {
    type: String,
  },

  banner: {
    type: String,
  },
  
  biography: {
    type: String,
    ref: "biography"
  },

  website: { 
    type: String, 
    ref: "website"
  },

  userType: {
    type: String,
    default: "personal",
    required: [true, "Can't be blank"],
  },

  token: {
    type: String,
  },

  emailToken: String,

  isVerified: {
    type: Boolean,
    default: false,
  },

  otpCode: {
    type: String,
  },
  otpExpiresAt: {
    type: Date,
  },

  passwordResetToken: String,
  passwordResetExpires: Date,
  passwordChangedAt: Date,

  registrationDate: {
    type: Date,
    default: Date.now,
  },

  lastLoginDate: {
    type: Date,
    default: null,
  },

  previousPasswords: {
     type: [String],
     trim: true,
  },


  otherAccounts: {
    type: Map,
    of: [String],
    ref: 'User'
},

  status: {
    type: String,
    default: 'online',
  },

  newMessages: {
    type: Object,
    default: {},
  },

  chats: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Chat' }],

  addresses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Address' }],

  Layers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Layer' }],
  
  gameInventory: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'GameInventory' },
  ],
  
  productInventory: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'ProductInventory' },
  ],
  
  wallet: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Wallet' }],
  
  
  notifications: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'Notification' },
  ],
  
  settings: { type: mongoose.Schema.Types.ObjectId, ref: 'Settings' },

  following: { type: [String], default: [] },
  followers: { type: [String], default: [] },

  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],

});
// Add better validations for uniqueness
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

/**
 * If passwordHash was not modified or document is new, move onto next part of middleware stack on user.save()
 * Otherwise set time passwordChangedAt
 * @function save
 * @this module:models~user
 * @param {Callback} next
 */
userSchema.pre("save", function (next) {
  if (!this.isModified("passwordHash") || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000; //putting password change 1 sec in the past to ensure jwt is issued before a password is changed
  next();
});
/**
 * Check if password was changed after JWT issues - when user logged in
 * @param {String} jwtTimestamp
 * @this module:models~user
 * @returns {Boolean}
 */
userSchema.methods.changedPasswordAfter = function (jwtTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = this.passwordChangedAt.getTime() / 1000;
    if (changedTimestamp > jwtTimestamp) return true;
  }
  return false;
};
/**
 * Create password reset token
 * @this module:models~user
 * @returns {String} resetToken
 */
userSchema.methods.createPasswordResetToken = function () {
  // Create random resetToken
  const resetToken = crypto.randomBytes(32).toString("hex");
  // Hash the generated reset token
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  // Set password reset token expiration time to 10 min from time issued
  this.passwordResetExpires = Date.now() + 600000; //add 10 min to current time
  return resetToken;
};
const User = mongoose.model("User", userSchema);

module.exports = User;
