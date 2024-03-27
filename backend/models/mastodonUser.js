const mongoose = require('mongoose');
const uniqueValidator = require("mongoose-unique-validator");


const mastodonUserSchema = new mongoose.Schema({
    mastodonUserId: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    accessToken: {
      type: String,
      required: true,
    },
  });
const MastodonUser = mongoose.model('MastodonUser', mastodonUserSchema);

module.exports = MastodonUser;