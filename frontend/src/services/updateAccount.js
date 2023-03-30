/**
 * @module updateAccount calls backend method for updating user information
 */

import axios from "axios";
import { getAuthToken } from "../util/auth";
const url = "/api/users/update/account";
/**
 * Updates user with provided account information
 * @param {Object} user user who is signed in and wants to update account information 
 * @returns {Object} response.data
 */
export const updateUser = async (user) => {
  const response = await axios.patch(url, user, {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  });
  return response.data;
};
