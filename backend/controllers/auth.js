const jwt = require("jsonwebtoken");
const authRouter = require("express").Router();
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

  return response.json({
    status: "Success",
    data: {
      resetToken,
    },
  });
});

module.exports = {
  authRouter: authRouter,
  protect: protect,
};

//exports.resetPassword = async (request, response, next) => {};
