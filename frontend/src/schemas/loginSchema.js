import * as yup from "yup";

export const schema = yup.object().shape({
  password: yup.string().trim().required("Required"),
  username: yup.string().trim().required("Required"),
});
