import axios from "axios";
const url = "/api/users/verification";

export const verifyUser = async (token) => {
  const response = await axios.patch(`${url}/?token=${token}`);
  return response.data;
};