/**
 * @module users
 * @const bcrypt
 * @const crypto
 * @const User models/user
 * @const protect /auth.protect
 * @const usersRouter
 * @function validate
 */

const bcrypt = require("bcrypt");
const { validate } = require("deep-email-validator");
const crypto = require("crypto");
const usersRouter = require("express").Router();
const User = require("../models/user");
const UserApp = require("../models/userApp");
const UserRank = require("../models/userRank");
const UserActivity = require("../models/userActivity");
const { body, validationResult } = require("express-validator");
const protect = require("./auth").protect;
const Email = require("./../utils/email");
const jwt = require('jsonwebtoken');


/**
 * GET /api/users/testauth
 * Test endpoint to check whether authorization is working properly
 * @function
 * @memberof module:users~usersRouter
 * @param {Callback} protect protect middleware
 * @param {Object} request.user The authenticated user
 * @param {Object} request The request
 * @param {Object} response The response
 */
usersRouter.get("/testauth", protect, async (request, response) => {
  response.json({
    message: "You are authorized to access testauth",
  });
});
/**
 * GET /api/users/
 * Controller method to get the list of users registered in the login system
 * @function
 * @memberof module:users~usersRouter
 * @param {Callback} protect protect middleware
 * @param {Object} request The request
 * @param {Object} response The response
 * @returns {Object[]} users
 * @returns {Number} numberOfUsers
 */

//POST api/users?username="<enter-username>"
usersRouter.get("/", async (request, response) => {
  const username = request.query.username;

  if (!username) {
    const users = await User.find({});
    response.json({
      status: "Success",
      numberOfUsers: users.length,
      users,
    });
  } else {
    const user = await User.findOne({ username });

    if (!user) {
      return response.status(404).json({
        status: "Fail",
        error: "User not found",
      });
    }

    response.json({
      status: "Success",
      user,
    });
  }
});

/**
 * POST /api/users/
 * Controller method to register a user
 * @function
 * @memberof module:users~usersRouter
 * @param {Object} request The request
 * @param {Object} response The response
 * @param {string} request.body.password Password of the user
 * @param {string} request.body.email Email of the user
 * @param {string} request.body.firstName First name of the user
 * @param {string} request.body.lastName Last name of the user
 * @param {string} request.body.phoneNumber Phone number of the user
 * @returns {string} emailToken
 * @returns {Object} savedUser
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

  //Check user is exist or not. If not, return with error message.
  // Update user register API
  const registerUser = async (request, response) => {
  try {
    // Check if the user already exists
    const userInfo = request.body;
    const userExists = await User.findOne({ $or: [{ email: userInfo.email }, { username: userInfo.username }] });

    if (userExists) {
      return response.status(400).json({
        status: "Fail",
        error: "User already exists",
      });
    }

    // Create a new user
    const newUser = new User(userInfo);
    await newUser.save();

    // Update UserActivity
    const userActivity = new UserActivity({
      UserID: newUser._id,
      ActivityID: userInfo.activityId,
      DatePerformed: new Date(),
      PointsEarned: 0, // Set initial points to 0
    });
    await userActivity.save();

    // Update UserRank
    const userRank = new UserRank({
      UserID: newUser._id,
      RankID: userInfo.rankId,
      AppID: userInfo.appId,
      DateAchieved: new Date(),
      IsActive: true, // Set initial rank as active
    });
    await userRank.save();

    // Update UserApp
    const userApp = new UserApp({
      UserID: newUser._id,
      AppID: userInfo.appId,
      LastActivityDate: new Date(),
      TotalActivityTime: 0, // Set initial total activity time to 0
      AppRank: userInfo.appRank,
    });
    await userApp.save();

    // Return user information
    return response.status(200).json({
      status: "Success",
      userId: newUser._id,
    });
  } catch (error) {
    return response.status(500).json({
      status: "Error",
      error: "Internal server error",
    });
  }
};

module.exports = registerUser;

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
 * POST /api/users/
 * Update User-App, User-Activity and User-Ranking
 * @function
 * @param {Object} request The request
 * @param {Object} response The response
 * @memberof module:users~usersRouter
 * @param {string} request.body._id Id to update various tokens
 * @returns updated user
 */
// Update User-App User-Activity and User-Ranking 
usersRouter.post('/:id', async (request, response) => {
  const { id } = request.body._id;

  try {
    // Find the user by ID
    const user = await User.findById(id);

    if (!user) {
      return response.status(404).json({
        status: 'Fail',
        error: 'User not found',
      });
    }

    // Update User-App, User-Activity, User-Rank information
    user.appName = request.body.appName || user.appName; // Update appName if provided, or keep the existing value
    user.userActivity = request.body.userActivity || user.userActivity; // Update userActivity if provided, or keep the existing value
    user.userRank = request.body.userRank || user.userRank; // Update userRank if provided, or keep the existing value

    // Save the updated user
    await user.save();

    // Return the updated user
    response.status(200).json({
      status: 'Success',
      user,
    });
  } catch (error) {
    response.status(500).json({
      status: 'Error',
      error: 'Internal server error',
    });
  }
});


/**
 * PATCH /api/users/verification
 * Controller method to verify user via an emailtoken
 * @function
 * @param {Object} request The request
 * @param {Object} response The response
 * @memberof module:users~usersRouter
 * @param {string} request.query.token Email token to verify account
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
 * PATCH /api/users/resend/email/:emailToken
 * Resends the verification link to the user
 * @function
 * @memberof module:users~usersRouter
 * @param {Object} request The request
 * @param {Object} response The response
 * @param {string} emailToken emailToken used to verify user account
 * @returns {String} emailToken
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
 * PATCH /api/users/update/account
 * Update user account info
 * @function
 * @memberof module:users~usersRouter
 * @param {string} request.body.email Email of the user
 * @param {string} request.body.password Password of the user
 * @param {string} request.body.firstName First name of the user
 * @param {string} request.body.lastName Last name of the user
 * @param {string} request.body.phoneNumber Phone number of the user
 * @returns {Object} User
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
    // Get errors of validation of body above
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
    // Check if email already exists
    const emailExists = await User.findOne({ email: infoToChange.email });
    // Check if phone number already exists
    const phoneNumberExists = await User.findOne({
      phoneNumber: infoToChange.phoneNumber,
    });
    // Check if username already exists
    const usernameExists = await User.findOne({
      username: infoToChange.username,
    });
    // Display error if email already taken, username already taken or phone number already taken
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
  }
);
/**
 * GET /api/users/view/account
 * View user account information
 * @function
 * @memberof module:users~usersRouter
 * @param {Object} request The request
 * @param {Object} response The response
 * @param {Object} request.user The authenticated user
 * @param {Callback} protect protect middleware
 * @returns {Object} User
 */
usersRouter.get("/view/account", protect, async (request, response) => {
  return response.status(200).json(request.user);
});
/**
 * DELETE /api/users/delete/account
 * Delete user account information
 * @function
 * @memberof module:users~usersRouter
 * @param {Object} request The request
 * @param {Object} response The response
 * @param {Object} request.user._id The authenticated user's id
 * @param {Callback} protect protect middleware
 * @returns {undefined}
 */
usersRouter.delete("/delete/account", protect, async (request, response) => {
  // Obtain authenticated user's id
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
