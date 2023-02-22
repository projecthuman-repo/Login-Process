const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { body, validationResult } = require("express-validator");
const loginRouter = require("express").Router();
const User = require("../models/user");

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
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(401).json({
        status: "Fail",
        errors: errors.array(),
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

    const userForToken = {
      username: user.username,
      id: user._id,
    };

    // token expires in 60 * 60 seconds (1hr)
    const token = jwt.sign(
      userForToken,
      process.env.SECRET,
      /*     { expiresIn: "60 * 60" } */
      { expiresIn: "20m" } //Change to 20 minutes, research and found it to be recommended
    );

    response.cookie("jwt", token, {
      expires: new Date(Date.now() + 2592000000), //set expiration date of cookie to 30 days from now
      secure: false, //only used with HTTPS
      httpOnly: true, //cookie cannot be accessed or modified by browser, prevents cross side scripting attacks
    });

    response.status(200).json({
      status: "Success",
      token,
      data: {
        username: user.username,
        firstName: user.firstName, //can add more later
      },
    });
  }
);

module.exports = loginRouter;
