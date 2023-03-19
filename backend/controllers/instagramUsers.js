const instagramUsersRouter = require("express").Router();
const { body, validationResult } = require("express-validator");
const InstagramUser = require("../models/instagramUser");

instagramUsersRouter.get("/", async (request, response) => {
  const instagramUsers = await InstagramUser.find({});
  response.json({
    status: "Success",
    numberOfInstagramUsers: instagramUsers.length,
    data: { instagramUsers },
  });
});

instagramUsersRouter.post(
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
    .withMessage("Invalid input for last name"),
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
    body("username")
    .not()
    .isEmpty()
    .trim()
    .escape()
    .withMessage("Invalid input for username"),
  async (request, response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(401).json({
        status: "Fail",
        errors: errors.array(),
      });
    }

    const { firstName, lastName, email, phoneNumber } = request.body;

    const instagramUser = new InstagramUser({
      firstName,
      lastName,
      email,
      phoneNumber,
    });

    const savedInstagramUser = await instagramUser.save();
    response.status(201).json({
      status: "Success",
      savedInstagramUser,
    });
  }
);

module.exports = instagramUsersRouter;
