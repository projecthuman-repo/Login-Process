import axios from "axios";
const baseUrl = "/api/users/verification";

export const verifyUser = async (token) => {
  const response = await axios.patch(`${baseUrl}/?token=${token}`);
  return response.data;
};