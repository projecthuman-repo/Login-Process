/**
 * @module registration calls backend method for registration
 */

import axios from "axios";
const url = "/api/users";

/**
 * Registers user
 * @param {Object} user user that has registered
 * @returns {Object} response.data
 */
export const registerUser = async (user) => {
  const response = await axios.post(url, user);
  return response.data;
};
