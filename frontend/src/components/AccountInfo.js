import { Button } from "react-bootstrap";
import { deleteAccount } from "../services/deleteAccount";

// Component for deleting and updating account information

export default function AccountInfo() {
  // Helper function to remove account
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
