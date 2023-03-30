/**
 * Logout service
 * @module logout
 */

/**
 * Logout user by removing token and expiration from localstorage
 * @function
 * @returns {undefined}
 *
 */
export function Logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("expiration");
}
