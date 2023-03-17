import axios from "axios";
const url = "/api/login";

export const login = async (user) => {
  const response = await axios.post(url, user);
  return response.data;
};
