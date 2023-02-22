import * as yup from "yup";

export const schema = yup.object().shape({
  username: yup.string().trim().required("Required"),
});
