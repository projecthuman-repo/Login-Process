import * as yup from "yup";

export const schema = yup.object().shape({
  email: yup.string().trim().required("Required"),
});
