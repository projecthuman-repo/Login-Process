import axios from "axios";
const url = "/api/users/resend/email";
export const resendVerificationLink = async (user, token) => {
  const response = await axios.patch(` ${url}/${token}`, user);
  return response.data;
};
