const googleUsersRouter = require("express").Router();
const { body, validationResult } = require("express-validator");
const GoogleUser = require("../models/googleUser");

googleUsersRouter.get("/", async (request, response) => {
  const googleUsers = await GoogleUser.find({});
  response.json({
    status: "Success",
    numberOfGoogleUsers: googleUsers.length,
    data: { googleUsers },
  });
});

googleUsersRouter.post("/", async (request, response) => {
  const { firstName, lastName, email } = request.body;
  if (GoogleUser.find({ email: email }) !== null) {
    return response.status(200).json({
      status: "Success",
      message: "User successfully logged in",
    });
  }
  const googleUser = new GoogleUser({
    firstName,
    lastName,
    email,
  });

  const savedGoogleUser = await googleUser.save();
  response.status(201).json({
    status: "Success",
    message: "Successfully created user",
    savedGoogleUser,
  });
});

module.exports = googleUsersRouter;
