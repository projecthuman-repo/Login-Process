import axios from "axios";
const url = "/api/googleUsers";

export const addGoogleUser = async (user) => {
  const response = await axios.post(url, user);
  return response.data;
};
