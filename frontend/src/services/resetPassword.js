import axios from "axios";
const baseUrl = "/api/authentication/resetPassword";

export const resetToken = async (user) => {
  const response = await axios.post(baseUrl, user);
  return response.data;
};
