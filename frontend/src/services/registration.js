import axios from "axios";
const baseUrl = "/api/users";

export const registerUser = async (user) => {
  // we will need to set something up to send a verification email to client
  /* const user = {
    firstName: info.firstName,
    lastName: info.lastName,
    username: info.registrationUsername,
    password: info.registrationPassword,
    email: info.email,
    phoneNumber: info.phoneNumber

  } */

  const response = await axios.post(baseUrl, user);
  return response.data;
};
