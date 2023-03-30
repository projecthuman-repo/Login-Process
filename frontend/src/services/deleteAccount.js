/**
 * Service module to call backend method to delete an account from user collection
 * @module addGoogleUser
 */

import axios from "axios";
import { getAuthToken } from "./../util/auth";
const url = "/api/users/delete/account";

/**
 * Deletes an account provided a valid authorization token is provided
 * User must be signed in for this function to work
 * @function
 * @returns {undefined}
 */
export const deleteAccount = async () => {
  // getAuthToken gets the authorization token from the user login
  await axios.delete(url, {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  });
  return;
};
