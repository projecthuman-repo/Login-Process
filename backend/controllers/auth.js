const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const { body, validationResult } = require("express-validator");
const authRouter = require("express").Router();
const Email = require("./../utils/email");
const User = require("../models/user");
const { reset } = require("nodemon");

const protect = async (request, response, next) => {
  //Obtain token
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
  //Verify token
  const decoded = jwt.verify(token, process.env.SECRET);
  //Check if user associated with token id
  const user = await User.findById(decoded.id);
  if (!user) {
    return response.status(401).json({
      status: "Fail",
      error: "No user associated with token",
    });
  }

  if (user.changedPasswordAfter(decoded.iat)) {
    return response.status(401).json({
      status: "Fail",
      error: "Password was changed, log in again",
    });
  }
  request.user = user;
  next();
};

authRouter.post("/forgotPassword", async (request, response) => {
  const user = await User.findOne({ email: request.body.email });

  if (!user) {
    return response.status(404).json({
      status: "Fail",
      error: "No user associated with the provided email",
    });
  }
  const resetToken = user.createPasswordResetToken();
  await user.save();

  const resetURL = `http://localhost:3000/resetPassword/?resetToken=${resetToken}`;
  try {
    await new Email(user, resetURL).sendPasswordReset();

    return response.status(200).json({
      status: "Success",
      message: "Token sent to email",
      resetToken,
    });
  } catch (err) {
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

authRouter.patch(
  "/resetPassword/",
  body("password")
    .isString()
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


