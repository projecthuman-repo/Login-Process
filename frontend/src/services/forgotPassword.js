/**
 * Service module to call backend method to send a forgot password link to the user's email
 * @module forgotPassword
 */

import axios from "axios";
const url = "/api/authentication/forgotPassword";

/**
 * Sends forgot password link to user'email
 * @function
 * @param {Object} user who wants to get a link to reset password
 * @returns {Object} response.data
 */
export const forgotPassword = async (user) => {
  const response = await axios.post(url, user);
  return response.data;
};
