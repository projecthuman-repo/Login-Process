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
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return response.status(401).json({
      status: "Fail",
      errors: errors.array(),
    });
  }

  const { firstName, lastName, email } = request.body;

  const googleUser = new GoogleUser({
    firstName,
    lastName,
    email,
  });

  const savedGoogleUser = await googleUser.save();
  response.status(201).json({
    status: "Success",
    savedGoogleUser,
  });
});

module.exports = googleUsersRouter;
