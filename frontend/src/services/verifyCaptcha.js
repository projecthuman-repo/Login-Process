import axios from "axios";
const url = "/api/authentication/verifyCaptcha";

export const verifyCaptcha = async (token) => {
  const response = await axios.post(url, { token });
  return response.data;
};
