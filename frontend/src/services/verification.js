/**
 * @module verification calls backend method for verifying user
 * 
 */

import axios from "axios";
const url = "/api/users/verification";

/**
 * Verifies user account
 * @param {string} token user token for verification of account 
 * @returns {Object} response.data
 */
export const verifyUser = async (token) => {
  const response = await axios.patch(`${url}/?token=${token}`);
  return response.data;
};