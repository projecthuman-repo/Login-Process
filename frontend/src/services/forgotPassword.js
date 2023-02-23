import axios from "axios";
const baseUrl = "/api/authentication/forgotPassword";

export const forgotPassword = async (user) => {
  const response = await axios.post(baseUrl, user);
  return response.data;
};
