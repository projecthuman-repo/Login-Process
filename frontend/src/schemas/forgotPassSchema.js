/**
 * Defines yup schema validation for email entered for forget password link
 * @module forgotPassSchema
 */

import * as yup from "yup";

// Email is required

export const schema = yup.object().shape({
  email: yup.string().email().trim().required("Required"),
});
