/**
 * @module resetPassword calls backend method for resetting password
 */

import axios from "axios";
const url = "/api/authentication/resetPassword";

/**
 * Resets user password
 * @param {string} token password reset token 
 * @param {string} password new password
 * @returns {Object} response.data
 */
export const resetPassword = async (token, password) => {
  const response = await axios.patch(`${url}/?resetToken=${token}`, password);
  return response.data;
};
