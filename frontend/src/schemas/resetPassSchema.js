/**
 * Defines yup schema validation for resetPassword
 * @module resetPassSchema
 */

import * as yup from "yup";
//Check if password has min one char, one symbol, one uppercase and one lowercase
const passwordRules = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/;

// password must follow rules above, confirmPassword must follow same rules + match password

export const schema = yup.object().shape({
  password: yup
    .string()
    .min(8)
    .max(10)
    .trim()
    .matches(passwordRules, {
      message:
        "Passwords must contain 8-10 characters, one special character, one lowercase letter, and one uppercase letter",
    })
    .required("Required"),
  confirmPassword: yup
    .string()
    .min(8)
    .max(10)
    .trim()
    .matches(passwordRules, {
      message:
        "Passwords must contain 8-10 characters, one special character, one lowercase letter, and one uppercase letter",
    })
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Required"),
});
