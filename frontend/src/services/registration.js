import axios from "axios";
const url = "/api/users";

export const registerUser = async (user) => {
  const response = await axios.post(url, user);
  return response.data;
};
