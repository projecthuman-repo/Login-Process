import axios from "axios";
import { getAuthToken } from "../util/auth";
const url = "/api/users/update/account";
export const updateUser = async (user) => {
  const response = await axios.patch(url, user, {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  });
  return response.data;
};
