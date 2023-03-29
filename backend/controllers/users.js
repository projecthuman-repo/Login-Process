const bcrypt = require("bcrypt");
const { validate } = require("deep-email-validator");
const crypto = require("crypto");
const usersRouter = require("express").Router();
const User = require("../models/user");
const { body, validationResult } = require("express-validator");
const protect = require("./auth").protect;
const Email = require("./../utils/email");

/**
 * Test endpoint to check whether authorization is working properly
 */
usersRouter.get("/testauth", protect, async (request, response) => {
  response.json({
    message: "You are authorized to access testauth",
  });
});
/**
 * Controller method to get the list of users registered in the login system
 * @returns users - list of objects, numberOfUsers - integer
 */
usersRouter.get("/", async (request, response) => {
  const users = await User.find({});
  response.json({
    status: "Success",
    numberOfUsers: users.length,
    users,
  });
});
/**
 * Controller method to register a user
 * @param {string} email Email of the user
 * @param {string} password Password of the user
 * @param {string} firstName First name of the user
 * @param {string} lastName Last name of the user
 * @param {string} phoneNumber Phone number of the user
 * @returns emailToken - string and savedUser - User object
 */
usersRouter.post(
  "/",
  body("email")
    .isString()
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage("Email entered is not a valid email"),
  body("password")
    .isString()
    .trim()
    .escape()
    .isStrongPassword({
      minLength: 8,
      maxLength: 10,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
      returnScore: false,
      pointsPerUnique: 1,
      pointsPerRepeat: 0.5,
      pointsForContainingLower: 10,
      pointsForContainingUpper: 10,
      pointsForContainingNumber: 10,
      pointsForContainingSymbol: 10, //in case we want to let the user know how good their password is
    })
    .withMessage(
      "Passwords must be between 8-10 characters long, have at least one uppercase letter, lowercase letter, number and symbol"
    ),
  body("username")
    .isString()
    .not()
    .isEmpty()
    .trim()
    .escape()
    .withMessage("Invalid input for username"),
  body("firstName")
    .isString()
    .not()
    .isEmpty()
    .trim()
    .escape()
    .withMessage("Invalid input for first name"),
  body("lastName")
    .isString()
    .not()
    .isEmpty()
    .trim()
    .escape()
    .withMessage("Invalid input for username"),
  body("phoneNumber")
    .isString()
    .not()
    .isEmpty()
    .trim()
    .escape()
    .isMobilePhone()
    .withMessage("Invalid input for phone number"),

  async (request, response) => {
    // Return result of express validator validations above
    const errors = validationResult(request).array();
    let list_errors = "";
    // Validate that email is real and not a fake/spam email
    let validate_email = await validate({
      email: request.body.email,
      sender: process.env.EMAIL_USERNAME,
      validateRegex: true,
      validateMx: true,
      validateTypo: true,
      validateDisposable: true,
      validateSMTP: false,
    });
    if (validate_email.valid !== true) {
      list_errors += "Email entered is not a real email\n";
    }
    for (let i = 0; i < errors.length; i++) {
      list_errors += errors[i].msg + "\n";
    }
    if (list_errors) {
      return response.status(400).json({
        status: "Fail",
        error: list_errors,
      });
    }

    const userInfo = request.body;
    const emailExists = await User.findOne({ email: userInfo.email });
    // Check if phoneNumber already exists in the system
    const phoneNumberExists = await User.findOne({
      phoneNumber: userInfo.phoneNumber,
    });
    // Check if username already exists in the system
    const usernameExists = await User.findOne({ username: userInfo.username });
    let exists_errors = "";
    // Add error if email already exists, email must be unique
    if (emailExists !== null) {
      exists_errors += "There already exists a user with the given email\n";
    }
    // Add error if phoneNumber already exists, phoneNumber must be unique
    if (phoneNumberExists !== null) {
      exists_errors +=
        "There already exists a user with the given phone number\n";
    }
    // Add error if username already exists, username must be unique
    if (usernameExists !== null) {
      exists_errors += "There already exists a user with the given username\n";
    }
    if (exists_errors) {
      return response.status(400).json({
        status: "Fail",
        error: exists_errors,
      });
    }
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(userInfo.password, saltRounds);
    // Generate email token to be sent to user's email to let them verify their account
    // Create and save user
    const emailToken = crypto.randomBytes(32).toString("hex");
    const user = new User({
      firstName: userInfo.firstName,
      lastName: userInfo.lastName,
      username: userInfo.username,
      passwordHash: passwordHash,
      email: userInfo.email,
      phoneNumber: userInfo.phoneNumber,
      emailToken: emailToken,
    });

    const savedUser = await user.save();
    // Send email to user to welcome them to the app and verify their email
    const url = `http://localhost:3000/verification/?token=${emailToken}`;
    try {
      await new Email(user, url).sendWelcomeToApp();
    } catch (err) {
      return response.status(500).json({
        status: "Fail",
        error: err,
      });
    }

    response.status(201).json({
      status: "Success",
      emailToken,
      savedUser,
    });
  }
);
/**
 * Controller method to verify user via a emailtoken
 * @param {string} emailToken Email token must be sent as a part of request body
 * @returns token Email Token that was sent to the user
 */

usersRouter.patch("/verification/", async (request, response) => {
  const token = request.query.token;
  const user = await User.findOne({ emailToken: token });
  // If no user associated with the token, user is not registered, send error
  if (!user) {
    return response.status(401).json({
      status: "Fail",
      error:
        "No user account associated with token, please go and register an account!",
    });
  }
  // Verify user and save user
  user.isVerified = true;
  await user.save();
  return response.json({
    status: "Success",
    token,
    message: "User has been successfully verified",
  });
});
/**
 * Resends the verification link to the user
 * @param {string} emailToken emailToken used to verify user account
 * @returns emailToken 
 */
usersRouter.patch("/resend/email/:emailToken", async (request, response) => {
  const emailToken = request.params.emailToken;
  const user = request.body;
  const url = `http://localhost:3000/verification/?token=${emailToken}`;
  try {
    await new Email(user, url).sendWelcomeToApp();

    return response.status(200).json({
      status: "Success",
      message: "Token sent again to email",
      emailToken,
    });
  } catch (err) {
    return response.status(500).json({
      status: "Fail",
      error: err,
    });
  }
});
/**
 * Update user account info
 * @param {string} email Email of the user
 * @param {string} password Password of the user
 * @param {string} firstName First name of the user
 * @param {string} lastName Last name of the user
 * @param {string} phoneNumber Phone number of the user
 * @returns User
 */
usersRouter.patch(
  "/update/account",
  body("email")
    .isString()
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage("Email entered is not a valid email"),
  body("username")
    .isString()
    .not()
    .isEmpty()
    .trim()
    .escape()
    .withMessage("Invalid input for username"),
  body("firstName")
    .isString()
    .not()
    .isEmpty()
    .trim()
    .escape()
    .withMessage("Invalid input for first name"),
  body("lastName")
    .isString()
    .not()
    .isEmpty()
    .trim()
    .escape()
    .withMessage("Invalid input for username"),
  body("phoneNumber")
    .isString()
    .not()
    .isEmpty()
    .trim()
    .escape()
    .isMobilePhone()
    .withMessage("Invalid input for phone number"),
  protect,
  async (request, response) => {
    const errors = validationResult(request).array();
    let list_errors = "";
    let validate_email = await validate({
      email: request.body.email,
      sender: process.env.EMAIL_USERNAME,
      validateRegex: true,
      validateMx: true,
      validateTypo: true,
      validateDisposable: true,
      validateSMTP: false,
    });
    if (validate_email.valid !== true) {
      list_errors += "Email entered is not a real email\n";
    }

    for (let i = 0; i < errors.length; i++) {
      list_errors += errors[i].msg + "\n";
    }
    if (list_errors) {
      return response.status(400).json({
        status: "Fail",
        error: list_errors,
      });
    }
    const infoToChange = request.body;
    const user = request.user;
    const emailExists = await User.findOne({ email: infoToChange.email });
    const phoneNumberExists = await User.findOne({
      phoneNumber: infoToChange.phoneNumber,
    });
    const usernameExists = await User.findOne({
      username: infoToChange.username,
    });
    let exists_errors = "";
    if (user.email !== infoToChange.email && emailExists !== null) {
      exists_errors += "There already exists a user with the given email\n";
    }

    if (
      user.phoneNumber !== infoToChange.phoneNumber &&
      phoneNumberExists !== null
    ) {
      exists_errors +=
        "There already exists a user with the given phone number\n";
    }

    if (user.username !== infoToChange.username && usernameExists !== null) {
      exists_errors += "There already exists a user with the given username\n";
    }
    if (exists_errors) {
      return response.status(400).json({
        status: "Fail",
        error: exists_errors,
      });
    }
    user.firstName = infoToChange.firstName;
    user.lastName = infoToChange.lastName;
    user.username = infoToChange.username;
    user.phoneNumber = infoToChange.phoneNumber;
    user.email = infoToChange.email;
    await user.save();

    return response.status(200).json({
      status: "Success",
      user,
    });

    // user.passwordHash =
  }
);

usersRouter.get("/view/account", protect, async (request, response) => {
  return response.status(200).json(request.user);
});

usersRouter.delete("/delete/account", protect, async (request, response) => {
  const id = request.user._id;
  try {
    await User.findByIdAndDelete(id);
    return response.status(204).send("User deleted successfully");
  } catch (e) {
    return response.status(500).json({
      status: "Fail",
      message: "User could not be deleted",
    });
  }
});

module.exports = usersRouter;
