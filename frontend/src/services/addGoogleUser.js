import axios from "axios";
const url = "/api/googleusers";

export const addGoogleUser = async (user) => {
  const response = await axios.post(url, user);
  return response.data;
};
