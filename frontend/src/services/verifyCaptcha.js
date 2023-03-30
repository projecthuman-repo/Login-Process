/**
 * @module verifyAccount calls backend method for verifying user captcha
 */

import axios from "axios";
const url = "/api/authentication/verifyCaptcha";

/**
 * Verifies captcha
 * @param {string} token obtained from captcha
 * @returns {Object} response.data
 */
export const verifyCaptcha = async (token) => {
  const response = await axios.post(url, { token });
  return response.data;
};
