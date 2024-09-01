import { API_URL } from "../constant";

export const authenticate = async () => {
  const response = await fetch(`${API_URL}auth`, {
    method: "GET",
    credentials: "include",
  });
  const data = await response.json();
  return data;
};
