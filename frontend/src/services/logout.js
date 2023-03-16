import { useNavigate } from "react-router-dom";
export function Action() {
  const navigate = useNavigate();
  localStorage.removeItem("token");
}
