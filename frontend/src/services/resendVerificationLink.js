import axios from "axios";
const baseUrl = "/api/users/resend/email";
export const resendVerificationLink = async (user, token) => {
  const response = await axios.patch(` ${baseUrl}/${token}`, user);
  return response.data;
};
