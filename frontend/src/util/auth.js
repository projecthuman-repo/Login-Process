/**
 * @module auth contains functions to get token duration, get auth token and check auth loader
 * Used for protected routes and authentication
 */

import { redirect } from "react-router-dom";
/**
 * Get duration of jwt token to keep track of how long user has been logged in
 * @function
 * @returns {Number} duration
 */
export function getTokenDuration() {
  // Get time jwt should expire at
  const storedExpirationDate = localStorage.getItem("expiration");
  const expirationDate = new Date(storedExpirationDate);
  const now = new Date();
  // Get time remaining for jwt before it expires
  const duration = expirationDate.getTime() - now.getTime(); //if > 0 token valid, if < 0, token invalid
  return duration;
}

/**
 * @returns {string} token for jwt/bearer token authentication
 */
export function getAuthToken() {
  // Get authentication token
  const token = localStorage.getItem("token");
  return token;
}
/**
 * Loader used for protected routes, checks if token exists and if it hasn't expired
 * @function
 * @returns {undefined|Boolean}
 */
export function checkAuthLoader() {
  // Get token using getAuthToken helper
  const token = getAuthToken();
  // If no token or token has expired redirect user to login screen, automatic logout of user
  if (!token || getTokenDuration() <= 0) {
    return redirect("/");
  }
  return null;
}
