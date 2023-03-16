import { Button } from "react-bootstrap";
import { deleteAccount } from "../services/deleteAccount";
export default function DeleteAccount() {
  function removeAccount() {
    deleteAccount()
      .then((data) => console.log(data))
      .catch((e) => {
        console.log(e);
      });
  }
  return (
    <Button variant="primary" type="submit" onClick={removeAccount}>
      Delete Account
    </Button>
  );
}
