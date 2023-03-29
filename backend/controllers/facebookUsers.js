const facebookUsersRouter = require("express").Router();
const FacebookUser = require("../models/facebookUser");
/**
 * This function will send a list of all facebook users in the database of signed up users
 * @returns facebookUsers - list of objects, numberOfFacebookUsers - integer
 */
facebookUsersRouter.get("/", async (request, response) => {
  const facebookUsers = await FacebookUser.find({});
  response.json({
    status: "Success",
    numberOfFacebookUsers: facebookUsers.length,
    data: { facebookUsers },
  });
});
/**
 * This function will create a new facebook user when a user signs into the registration system
 * @returns savedFacebookUser - object
 */
facebookUsersRouter.post("/", async (request, response) => {
  const { firstName, lastName, email, phoneNumber } = request.body;

  if (FacebookUser.find({ email: email }) !== null) {
    return response.status(200).json({
      status: "Success",
      message: "User successfully logged in",
    });
  }
  const facebookUser = new FacebookUser({
    firstName,
    lastName,
    email,
    phoneNumber,
  });

  const savedFacebookUser = await facebookUser.save();
  response.status(201).json({
    status: "Success",
    savedFacebookUser,
  });
});

module.exports = facebookUsersRouter;
