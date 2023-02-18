import * as yup from "yup";
//Check if password has min one char, one symbol, one uppercase and one lowercase
const passwordRules = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/;

export const schema = yup.object().shape({
  email: yup
    .string()
    .trim()
    .email("Please enter a valid email")
    .required("Required"),
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
  username: yup.string().trim().required("Required"),
  firstName: yup.string().trim().required("Required"),
  lastName: yup.string().trim().required("Required"),
  phoneNumber: yup.string().required("Required"),
});
