/**
 * @module resendVerificationLink calls backend method for resending verification link
 */

import axios from "axios";
const url = "/api/users/resend/email";
/**
 * Resends verification link
 * @param {Object} user user who has registered and wants verification link
 * @param {string} token token for verifying account
 * @returns {Object} response.data
 */
export const resendVerificationLink = async (user, token) => {
  const response = await axios.patch(` ${url}/${token}`, user);
  return response.data;
};
