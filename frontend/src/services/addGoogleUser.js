/**
 * Service module to call backend method to store a google user into googleusers collection
 * @module addGoogleUser
 */

import axios from "axios";
const url = "/api/googleUsers/";

/**
 * Adds a google into database
 * @function
 * @param {Object} user google user who signed in 
 * @returns {Object} response.data
 */
export const addGoogleUser = async (user) => {
  const response = await axios.post(url, user);
  return response.data;
};
