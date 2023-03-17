import axios from "axios";
const url = "/api/authentication/resetPassword";

export const resetPassword = async (token, password) => {
  const response = await axios.patch(
    `${url}/?resetToken=${token}`,
    password
  );
  return response.data;
};
