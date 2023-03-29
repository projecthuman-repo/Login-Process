/**
 * @module googleUsers
 * @requires express,googleUser
 */

const googleUsersRouter = require("express").Router();
const GoogleUser = require("../models/googleUser");

/**
 * This function will send a list of all google users in the database of signed up users
 * @memberof module:googleUsers~googleUsersRouter
 * @function
 * @param {Object} request The request
 * @param {Object} response The response
 * @returns {Object[]} googleUsers registered
 * @returns {Number} numberOfGoogleUsers
 */

googleUsersRouter.get("/", async (request, response) => {
  const googleUsers = await GoogleUser.find({});
  response.json({
    status: "Success",
    numberOfGoogleUsers: googleUsers.length,
    data: { googleUsers },
  });
});

/**
 * This function will create a new google user when a user signs into the registration system
 * @memberof module:googleUsers~googleUsersRouter
 * @function
 * @param {Object} request The request
 * @param {Object} response The response
 * @returns {Object} savedGoogleUser 
 */

googleUsersRouter.post("/", async (request, response) => {
  const { firstName, lastName, email } = request.body;
  // Check if user is already registered as a google user
  if (GoogleUser.find({ email: email }) !== null) {
    return response.status(200).json({
      status: "Success",
      message: "User successfully logged in",
    });
  }

  // Create and save google user
  const googleUser = new GoogleUser({
    firstName: firstName,
    lastName: lastName,
    email: email,
  });

  const savedGoogleUser = await googleUser.save();
  response.status(201).json({
    status: "Success",
    message: "Successfully created user",
    savedGoogleUser,
  });
});

module.exports = googleUsersRouter;
