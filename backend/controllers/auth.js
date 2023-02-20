const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const authRouter = require("express").Router();
const sendEmail = require("./../utils/email");
const User = require("../models/user");

const protect = async (request, response, next) => {
  //Obtain token
  if (
    request.headers.authorization &&
    request.headers.authorization.startsWith("Bearer")
  ) {
    var token = request.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return response.status(401).json({
      status: "Fail",
      message: "You are not authorized",
    });
  }
  //Verify token
  const decoded = jwt.verify(token, process.env.SECRET);
  //Check if user associated with token id
  const user = await User.findById(decoded.id);
  if (!user) {
    return response.status(401).json({
      status: "Fail",
      message: "No user associated with token",
    });
  }

  if (user.changedPasswordAfter(decoded.iat)) {
    return response.status(401).json({
      status: "Fail",
      message: "Password was changed, log in again",
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
      message: "No user associated with the provided email",
    });
  }
  const resetToken = user.createPasswordResetToken();
  await user.save();

  const resetURL = `${request.protocol}://${request.get(
    "host"
  )}/api/authentication/resetPassword/${resetToken}`;
  const message = `Forgot password? Submit PATCH request with your new password to ${resetURL}\nIf you didn't forget your password, ignore this email!`;
  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset token, 10 MINUTES TILL EXPIRATION",
      message: message,
    });

    return response.status(200).json({
      status: "Success",
      message: "Token sent to email",
      data: {
        resetToken,
      },
    });
  } catch (err) {
    user.createPasswordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.save();

    return response.status(500).json({
      status: "Fail",
      message: "Email was not sent",
      err,
    });
  }
});

module.exports = {
  authRouter: authRouter,
  protect: protect,
};

authRouter.patch("/resetPassword/:token", async (request, response) => {
  const resetToken = request.params.token;
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
      message: "Token is invalid or expired",
    });
  }
  const passwordToChangeTo = request.body.password;
  const saltRounds = 10;
  const newHashedPassword = await bcrypt.hash(passwordToChangeTo, saltRounds);
  user.passwordHash = newHashedPassword;
  user.passwordResetExpires = undefined;
  user.passwordResetToken = undefined; //removing user reset token after user changed password
  await user.save();
  //Log user in via JWT
  const userForToken = {
    username: user.username,
    id: user._id,
  };

  // token expires in 20 min
  const token = jwt.sign(userForToken, process.env.SECRET, {
    expiresIn: "20m",
  });

  response.status(200).json({
    status: "Success",
    token,
  });
});
