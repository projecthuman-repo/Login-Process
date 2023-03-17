import { redirect } from "react-router-dom";

export function getTokenDuration() {
  const storedExpirationDate = localStorage.getItem("expiration");
  const expirationDate = new Date(storedExpirationDate);
  const now = new Date();
  const duration = expirationDate.getTime() - now.getTime(); //if > 0 token valid, if < 0, token invalid
  return duration;
}

export function getAuthToken() {
  const token = localStorage.getItem("token");
  return token;
}
export function checkAuthLoader() {
  const token = getAuthToken();
  if (!token || getTokenDuration() <= 0) {
    return redirect("/");
  }
  return null;
}
