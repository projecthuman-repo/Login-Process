import axios from "axios";
import { getAuthToken } from "./../util/auth";
const url = "/api/users/delete/account";

export const deleteAccount = async () => {
  const response = await axios.delete(url, {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  });
  return;
};
