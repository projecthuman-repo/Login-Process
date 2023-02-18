const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const usersRouter = require("express").Router();
const User = require("../models/user");
const protect = require("./auth").protect;

usersRouter.get("/", async (request, response) => {
  const users = await User.find({});
  response.json(users);
});

usersRouter.post("/", async (request, response) => {
  // const { firstName, lastName, username, password, email, phoneNumber } = request.body
  const userInfo = request.body;

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(userInfo.password, saltRounds);

  const user = new User({
    firstName: userInfo.firstName,
    lastName: userInfo.lastName,
    username: userInfo.username,
    passwordHash: passwordHash,
    email: userInfo.email,
    phoneNumber: userInfo.phoneNumber,
  });

  const userForToken = {
    username: user.username,
    id: user._id,
  };

  // token expires in 60 * 60 seconds (1hr)
  const token = jwt.sign(userForToken, process.env.SECRET, {
    expiresIn: 60 * 60,
  });

  /*   response
    .status(200)
    .send({ token, username: user.username, firstName: user.firstName }); // we can add more as we go */

  const savedUser = await user.save();
  response.status(201).json({
    status: "Success",
    token,
    data: { savedUser },
  });
});

usersRouter.get("/testauth", protect, async (request, response) => {
  response.json({
    message: "You are authorized to access testauth",
  });
});

module.exports = usersRouter;
