import axios from "axios";
const baseUrl = "/api/authentication/resetPassword";

export const resetPassword = async (token, password) => {
  const response = await axios.patch(
    `${baseUrl}/?resetToken=${token}`,
    password
  );
  return response.data;
};
