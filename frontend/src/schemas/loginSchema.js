import * as yup from "yup";

export const schema = yup.object().shape({
  password: yup.string().trim().required("Required"),
  /*   confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Required"), */
  username: yup.string().trim().required("Required"),
});
