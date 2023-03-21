const facebookUsersRouter = require("express").Router();
const { body, validationResult } = require("express-validator");
const FacebookUser = require("../models/facebookUser");

facebookUsersRouter.get("/", async (request, response) => {
  const facebookUsers = await FacebookUser.find({});
  response.json({
    status: "Success",
    numberOfFacebookUsers: facebookUsers.length,
    data: { facebookUsers },
  });
});

facebookUsersRouter.post("/", async (request, response) => {
  const { firstName, lastName, email, phoneNumber } = request.body;

  if (FacebookUser.find({ email: email }) !== null) {
    return response.status(200).json({
      status: "Success",
      message: "User successfully logged in",
    });
  }
  const facebookUser = new FacebookUser({
    firstName,
    lastName,
    email,
    phoneNumber,
  });

  const savedFacebookUser = await facebookUser.save();
  response.status(201).json({
    status: "Success",
    savedFacebookUser,
  });
});

module.exports = facebookUsersRouter;
