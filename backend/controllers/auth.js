/**
 * @module auth
 * @requires jsonwebtoken,bcrypt,crypto,Email,User,axios,express-validator
 */

/**
 * @const jsonwebtoken jsonwebtoken module
 * @const crypto crypto module
 * @const bcrypt bcrypt module
 * @const Email utils/email
 * @const User models/user
 * @function body from express validator
 *
 */

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const { body, validationResult } = require("express-validator");
/**
 * @type {object}
 * @const
 * @namespace authRouter authRouter
 */
const authRouter = require("express").Router();
const Email = require("./../utils/email");
const User = require("../models/user");
const axios = require("axios");

/**
 * This middleware will check if there is a jwt token or cookie in the request headers
 * which can be used to prevent unauthorized access to other controller methods/functions.
 * Will check if user is logged in
 * @function
 * @memberof module:auth~authRouter
 * @param {Object} request The request
 * @param {Object} response The response
 * @param {string} request.headers.authorization The jwt/cookie in a bearer token
 * @param {function} next
 * @returns {undefined}
 */

const protect = async (request, response, next) => {
  // Check if token or cookie present in request headers
  if (
    request.headers.authorization &&
    request.headers.authorization.startsWith("Bearer")
  ) {
    var token = request.headers.authorization.split(" ")[1];
  } else if (request.cookies.jwt) {
    var token = request.cookies.jwt;
  }

  if (!token) {
    return response.status(401).json({
      status: "Fail",
      error: "You are not authorized",
    });
  }
  // Verify token
  const decoded = jwt.verify(token, process.env.SECRET);
  // Check if user associated with token id
  const user = await User.findById(decoded.id);
  // If no user found send error message
  if (!user) {
    return response.status(401).json({
      status: "Fail",
      error: "No user associated with token",
    });
  }
  // If user changed password after the jwt was decoded meaning user logged in, send error
  if (user.changedPasswordAfter(decoded.iat)) {
    return response.status(401).json({
      status: "Fail",
      error: "Password was changed, log in again",
    });
  }
  // Attach user to request object
  request.user = user;
  next();
};

/**
 * POST /api/authentication/forgotPassword
 * Sends a reset password link to the email specified in request body
 * @function
 * @memberof module:auth~authRouter
 * @param {Object} request The request
 * @param {Object} response The response
 * @param {string} request.body.email Email of user where forgot password link will be sent
 * @returns {string} resetToken - String in response body
 */

authRouter.post("/forgotPassword", async (request, response) => {
  const user = await User.findOne({ email: request.body.email });
  // If no user associated with email provided, send error message
  if (!user) {
    return response.status(404).json({
      status: "Fail",
      error: "No user associated with the provided email",
    });
  }
  // Call instance method to create password reset token and save user
  const resetToken = user.createPasswordResetToken();
  await user.save();
  // Send user password reset email
  const resetURL = `http://localhost:3000/resetPassword/?resetToken=${resetToken}`;
  try {
    await new Email(user, resetURL).sendPasswordReset();

    return response.status(200).json({
      status: "Success",
      message: "Token sent to email",
      resetToken,
    });
  } catch (err) {
    // Delete password reset token and password reset expires if they did not receive email
    user.createPasswordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.save();

    return response.status(500).json({
      status: "Fail",
      error: err,
    });
  }
});

module.exports = {
  authRouter: authRouter,
  protect: protect,
};

/**
 * PATCH /api/authentication/resetPassword/?resetToken={resetToken}
 * Resets the password of the user to the password sent in the request body
 * @function
 * @memberof module:auth~authRouter
 * @param {Object} request The request
 * @param {Object} response The response
 * @param {string} request.body.password New password chosen by user to be used for password reset
 * @returns {undefined}
 */

authRouter.patch(
  "/resetPassword/",
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
  async (request, response) => {
    // Get errors from express validator validation above
    const errors = validationResult(request).array();
    let list_errors = "";
    for (let i = 0; i < errors.length; i++) {
      list_errors += errors[i].msg + "\n";
    }
    if (list_errors) {
      return response.status(400).json({
        status: "Fail",
        error: list_errors,
      });
    }
    const resetToken = request.query.resetToken;
    // Hash reset token, prevent anyone from finding reset token via DB
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }, //check that password reset token has not expired
    });

    if (!user) {
      return response.status(400).json({
        status: "Fail",
        error: "Token is invalid or expired",
      });
    }
    const passwordToChangeTo = request.body.password;
    const saltRounds = 10;
    // Hash password and save user
    const newHashedPassword = await bcrypt.hash(passwordToChangeTo, saltRounds);
    user.passwordHash = newHashedPassword;
    user.passwordResetExpires = undefined;
    user.passwordResetToken = undefined; //removing user reset token after user changed password
    await user.save();

    response.status(200).json({
      status: "Success",
      message: "Successfully reset password",
    });
  }
);
/**
 * POST /api/authentication/verifyCaptcha
 * Controller method to verify the captcha response from the token in the request body
 * @function
 * @memberof module:auth~authRouter
 * @param {Object} request The request
 * @param {Object} response The response
 * @returns {undefined}
 */
authRouter.post("/verifyCaptcha", async (request, response) => {
  const { token } = request.body;
  console.log(token);
  // Send post request to below link to verify the token from the captcha
  response_captcha = await axios.post(
    `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.SECRET_CAPTCHA_KEY}&response=${token}`
  );
  // If response captcha status is 200 then human identified else bot detected
  if (response_captcha.status === 200) {
    response.status(200).json({
      status: "Success",
      message: "Human user",
    });
  } else {
    response.status(401).json({
      status: "Fail",
      message: "Bot detected",
    });
  }
});
