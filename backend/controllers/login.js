const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { body, validationResult } = require("express-validator");
const loginRouter = require("express").Router();
const User = require("../models/user");
/**
 * Controller method to log in user
 * @param {string} username The user's username
 * @param {string} password The user's password
 * @returns token - string, username - string, firstName - string
 */
loginRouter.post(
  "/",
  body("username")
    .not()
    .isEmpty()
    .trim()
    .escape()
    .withMessage("Invalid input for username"),
  body("password")
    .not()
    .isEmpty()
    .trim()
    .escape()
    .withMessage("Invalid input for password"),

  async (request, response) => {
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
    const { username, password } = request.body;

    const user = await User.findOne({ username });

    const passwordCorrect =
      user === null ? false : await bcrypt.compare(password, user.passwordHash);

    if (!(user && passwordCorrect)) {
      return response.status(401).json({
        status: "Fail",
        error: "Invalid username or password",
      });
    }

    if (user.isVerified === false) {
      return response.status(401).json({
        status: "Fail",
        error:
          "User does not correspond to a verified account, please check your email and verfy your account if you already registered",
      });
    }

    const userForToken = {
      username: user.username,
      id: user._id,
    };

    // token expires in 60 * 60 seconds (1hr)
    const token = jwt.sign(userForToken, process.env.SECRET, {
      expiresIn: "1h",
    });

    // response.cookie("jwt", token, {
    //   expires: new Date(Date.now() + 2592000000), //set expiration date of cookie to 30 days from now
    //   secure: false, //only used with HTTPS
    //   httpOnly: true, //cookie cannot be accessed or modified by browser, prevents cross side scripting attacks
    // });

    response.status(200).json({
      status: "Success",
      token,
      username: user.username,
      firstName: user.firstName, //can add more later
    });
  }
);

module.exports = loginRouter;
