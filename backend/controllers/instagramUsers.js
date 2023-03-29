const instagramUsersRouter = require("express").Router();
const InstagramUser = require("../models/instagramUser");

/**
 * This function will send a list of all instagram users in the database of signed up users
 * @returns instagramUsers - list of objects, numberOfInstagramUsers - integer
 */

instagramUsersRouter.get("/", async (request, response) => {
  const instagramUsers = await InstagramUser.find({});
  response.json({
    status: "Success",
    numberOfInstagramUsers: instagramUsers.length,
    data: { instagramUsers },
  });
});
/**
 * This function will create a new instagram user when a user signs into the registration system
 * @returns savedInstagramUser - object
 */
instagramUsersRouter.post("/", async (request, response) => {
  const { firstName, lastName, email, phoneNumber } = request.body;

  if (InstagramUser.find({ email: email }) !== null) {
    return response.status(200).json({
      status: "Success",
      message: "User successfully logged in",
    });
  }

  const instagramUser = new InstagramUser({
    firstName,
    lastName,
    email,
    phoneNumber,
  });

  const savedInstagramUser = await instagramUser.save();
  response.status(201).json({
    status: "Success",
    savedInstagramUser,
  });
});

module.exports = instagramUsersRouter;
