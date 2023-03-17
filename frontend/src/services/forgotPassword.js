import axios from "axios";
const url = "/api/authentication/forgotPassword";

export const forgotPassword = async (user) => {
  const response = await axios.post(url, user);
  return response.data;
};
