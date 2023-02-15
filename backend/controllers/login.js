const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const loginRouter = require("express").Router();
const User = require("../models/user");

loginRouter.post("/", async (request, response) => {
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

  response.status(200).json({
    status: "Success",
    data: {
      token,
      username: user.username,
      firstName: user.firstName,
    },
  });
});

module.exports = loginRouter;
