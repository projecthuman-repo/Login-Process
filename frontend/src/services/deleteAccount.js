import axios from "axios";
import { getAuthToken } from "./../util/auth";
const baseUrl = "/api/users/delete/account";

export const deleteAccount = async () => {
  const response = await axios.delete(baseUrl, {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  });
  return;
};
