import axios from "axios";
const baseUrl = "/api/users";

export const registerUser = async (user) => {
  const response = await axios.post(baseUrl, user);
  return response.data;
};
