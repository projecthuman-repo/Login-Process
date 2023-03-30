/**
 * Defines yup schema validation for login
 * @module loginSchema
 */

import * as yup from "yup";

/**
 * username and password are both required
 */
export const schema = yup.object().shape({
  password: yup.string().trim().required("Required"),
  username: yup.string().trim().required("Required"),
});
