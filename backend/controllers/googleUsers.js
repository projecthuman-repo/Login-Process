const googleUsersRouter = require("express").Router();
const { body, validationResult } = require("express-validator");
const GoogleUser = require("../models/googleUser");

googleUsersRouter.get("/", async (request, response) => {
  const googleUsers = await GoogleUser.find({});
  response.json({
    status: "Success",
    data: { googleUsers },
  });
});

googleUsersRouter.post(
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

    const googleUser = new GoogleUser({
      firstName,
      lastName,
      email,
      phoneNumber,
    });

    const savedGoogleUser = await googleUser.save();
    response.status(201).json({
      status: "Success",
      savedGoogleUser,
    });
  }
);

module.exports = googleUsersRouter;
