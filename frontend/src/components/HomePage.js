import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Logout } from "../services/logout";
export default function HomePage() {
  const navigate = useNavigate();
  // Log user out and redirect to home page
  function logout() {
    Logout();
    navigate("/");
  }

  return (
    <div>
      <div>
        <a href="/view/account">Go here to view or change account info</a>
      </div>
      <Button variant="primary" type="submit" onClick={logout}>
        Logout
      </Button>
    </div>
  );
}
