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
const CrossPlatformUser = require("../models/cross-platform/User");
const App = require("../models/app");
const Activity = require("../models/activity");
const Rank = require("../models/rank");
const { body, validationResult } = require("express-validator");
const protect = require("./auth").protect;
const Email = require("./../utils/email");
const jwt = require("jsonwebtoken");

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
 * @returns {Object} newUser
 */

// POST method to register a user
usersRouter.post(
  "/",
  [
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
        pointsForContainingSymbol: 10,
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
      .withMessage("Invalid input for last name"),
    body("phoneNumber")
      .isString()
      .not()
      .isEmpty()
      .trim()
      .escape()
      .isMobilePhone()
      .withMessage("Invalid input for phone number"),
  ],
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

    // Call the registerUser controller method and pass the request body
    registerUser(request, response);
  }
);
// Check user is exist or not. If not, return with an error message.
// If user exists, check if connected to app or not
// Update user register API
const registerUser = async (request, response) => {
  try {
    const userInfo = request.body;

    // Check if the user already exists
    const userExists = await User.findOne({
      $or: [{ email: userInfo.email }, { username: userInfo.username }],
    });
    if (userExists) {
      // Check if the user is already connected to the app
      const app = await App.findOne({ appId: userInfo.appId });
      if (app == null) {
        return response.status(400).json({
          status: "Fail",
          error: "No appId provided",
        });
      }
      const userAppExists = await UserApp.findOne({
        userId: userExists._id,
        appId: app._id,
      });
      if (userAppExists) {
        return response.status(400).json({
          status: "Fail",
          error: "User is already connected to the app",
        });
      } else {
        // Create a new user-app connection
        const newUserApp = new UserApp({
          userId: userExists._id,
          app: userInfo.appId,
          appVersion: "",
          lastActivityDate: new Date(),
          totalActivityTime: 0,
          appRank: "",
        });
        await newUserApp.save();

        return response.status(200).json({
          status: "Success",
          userId: userExists._id,
        });
      }
    }

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
    const newUser = new User({
      firstName: userInfo.firstName,
      lastName: userInfo.lastName,
      username: userInfo.username,
      passwordHash: passwordHash,
      email: userInfo.email,
      phoneNumber: userInfo.phoneNumber,
      picture: userInfo.picture ? userInfo.picture : " ",
      emailToken: emailToken,
      isVerified: false,
      passwordResetToken: "",
      passwordResetExpires: null,
      passwordChangesAt: null,
      registrationDate: new Date(),
      lastLoginDate: null,
      previousPasswords: [],
    });

    await newUser.save();

    // CrossPlatformUser manages the 3 web app users (lotuslearning, regenquest, spotstitch)
    // In this scenario, we assume that the user is creating with LotusLearning
    // If the CrossPlatformUser has not been created with other platform, create a new one
    const crossPlatformUserExists = await CrossPlatformUser.findOne({
      $or: [{ email: newUser.email }, { phoneNumber: newUser.phoneNumber }],
    });
    if (crossPlatformUserExists) {
      crossPlatformUserExists.lotuslearningUserId = newUser._id;
      await crossPlatformUserExists.save();
    } else {
      const newCrossPlatformUser = new CrossPlatformUser({
        email: newUser.email,
        phoneNumber: newUser.phoneNumber,
        lotuslearningUserId: newUser._id,
      });
      await newCrossPlatformUser.save();
    }

    //Get the activity details
    /*
    const activity = await Activity.findById(1);

    if (!activity) {
      return response.status(400).json({
        status: "Fail",
        error: "Activity not found",
      });
    }

    // Update UserActivity
    const userActivity = new UserActivity({
      userId: newUser._id,
      activityId: activity._id,
      datePerformed: new Date(),
      pointsEarned: activity.activityPoints,
    });
    await userActivity.save();

    // Update UserApp
    const userApp = new UserApp({
      userId: newUser._id,
      appId: app._id,
      appVersion: "",
      lastActivityDate: new Date(),
      totalActivityDate: 0,
      totalPoints: activity.activityPoints,
      currentRank: "",
    });
    await userApp.save();

    // // Check if the user achieved a rank
    const rank = await Rank.findOne({
      rankPoints: { $lte: userApp.totalPoints },
    }).sort("-rankPoints");
    if (rank) {
      // Update UserRank
      const userRank = new UserRank({
        userId: newUser._id,
        appId: app._id,
        rankId: rank.rankId,
        dateAchieved: new Date(),
      });
      await userRank.save();

      // Update UserApp with the new rank
      userApp.currentRank = rank.rankId;
      await userApp.save();
    }
*/
    // Send email to user to welcome them to the app and verify their email
    const url = `http://localhost:3000/verification/?token=${emailToken}`;
    try {
      await new Email(newUser, url).sendWelcomeToApp();
    } catch (err) {
      console.log(err);
      return response.status(500).json({
        status: "Fail",
        error: err.message,
      });
    }

    response.status(201).json({
      status: "Success",
      emailToken,
      newUser,
    });
  } catch (error) {
    console.error(error); // Log the error to the console for debugging purposes

    return response.status(500).json({
      status: "Error",
      error: error.message, // Return the actual error message in the response
    });
  }
};

module.exports = registerUser;

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
usersRouter.get("/:id", async (request, response) => {
  const { id } = request.params;

  try {
    // Find the user by ID
    const user = await User.findById(id);

    if (!user) {
      return response.status(404).json({
        status: "Fail",
        error: "User not found",
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
      status: "Success",
      user,
    });
  } catch (error) {
    response.status(500).json({
      status: "Error",
      error: "Internal server error",
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
  body("picture")
    .isString()
    .not()
    .isEmpty()
    .trim()
    .escape()
    .withMessage("Invalid input for picture"),
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
    user.picture = infoToChange.picture;
    await user.save();

    // CrossPlatformUser manages the 3 web app users (lotuslearning, regenquest, spotstitch)
    // In this scenario, we assume that the user has created with LotusLearning
    const crossPlatformUserExists = await CrossPlatformUser.findOne({
      lotuslearningUserId: user._id,
    });
    crossPlatformUserExists.email = user.email;
    crossPlatformUserExists.phoneNumber = user.phoneNumber;
    await crossPlatformUserExists.save();

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
  const crossPlatformUser = await CrossPlatformUser.findOne({
    lotuslearningUserId: id,
  });
  try {
    await User.findByIdAndDelete(id);

    // CrossPlatformUser manages the 3 web app users (lotuslearning, regenquest, spotstitch)
    // Not deleting the CrossPlatformUser, but setting the lotuslearningUserId to empty string
    crossPlatformUser.lotuslearningUserId = "";
    await crossPlatformUser.save();

    return response.status(204).send("User deleted successfully");
  } catch (e) {
    console.log(e);
    return response.status(500).json({
      status: "Fail",
      message: "User could not be deleted",
    });
  }
});

module.exports = usersRouter;
