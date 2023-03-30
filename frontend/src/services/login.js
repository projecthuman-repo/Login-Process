/**
 * Service module to call backend method for logging in
 * @module login
 */

import axios from "axios";
const url = "/api/login";
/**
 * Logging in a user
 * @function
 * @param {Object} user user that has logged in
 * @returns {Object} response.data
 */
export const login = async (user) => {
  const response = await axios.post(url, user);
  return response.data;
};
