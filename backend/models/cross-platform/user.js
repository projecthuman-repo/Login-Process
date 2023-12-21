const mongoose = require("mongoose");
const { crossPlatformDbConnection } = require("../../db/connection");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
  },
  lotuslearningUserId: {
    type: String,
  },
  regenquestUserId: {
    type: String,
  },
  spotstitchUserId: {
    type: String,
  },
});

const CrossPlatformUser = crossPlatformDbConnection.model("User", userSchema);

module.exports = CrossPlatformUser;
