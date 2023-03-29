/**
 * @module instagramUsers
 * @requires express,instagramUser
 */

const instagramUsersRouter = require("express").Router();
const InstagramUser = require("../models/instagramUser");

/**
 * This function will show the list of all instagram users in the database of signed up users
 * @memberof module:instagramUsers~instagramUsersRouter
 * @function
 * @param {Object} request The request
 * @param {Object} response The response
 * @returns {Object[]} instagramUsers registered
 * @returns {Number} numberOfinstagramUsers
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
 * @memberof module:instagramUsers~instagramUsersRouter
 * @function
 * @param {Object} request The request
 * @param {Object} response The response
 * @returns {Object} savedInstagramUser
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
