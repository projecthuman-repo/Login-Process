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

facebookUsersRouter.post(
  "/",
  body("firstName")
    .not()
    .isEmpty()
    .trim()
    .escape()
    .withMessage("Invalid input for first name"),
  body("lastName")
    .not()
    .isEmpty()
    .trim()
    .escape()
    .withMessage("Invalid input for username"),
  body("phoneNumber")
    .not()
    .isEmpty()
    .trim()
    .escape()
    .isMobilePhone()
    .withMessage("Invalid input for phone number"),
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Email entered is not a valid email"),
  async (request, response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(401).json({
        status: "Fail",
        errors: errors.array(),
      });
    }

    const { firstName, lastName, email, phoneNumber } = request.body;

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
  }
);

module.exports = facebookUsersRouter;
