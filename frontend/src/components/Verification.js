import { verifyUser } from "../services/verification";
import { React, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

// Component for verification page

export default function Verification() {
  // Hooks
  const [searchParams, setSearchParams] = useSearchParams();
  const [verifyError, setVerifyError] = useState(null);
  const navigate = useNavigate();
  // get token for verification from query params
  let token = searchParams.get("token");
  console.log(token);
  // verify user as soon as they click on link and land on this component/page
  verifyUser(token)
    .then((data) => {
      console.log(data);
      // Go to login screen
      navigate("/");
    })
    .catch((err) => {
      console.log(err);
      alert(err.response.data.error.split("\n"));
      // Go to login screen
      navigate("/");
    });
  return (
    <div>
      {verifyError !== null ? (
        <div>
          {verifyError.map((error) => (
            <p className="text-danger">{error}</p>
          ))}
        </div>
      ) : (
        <p className="text-success"></p>
      )}
    </div>
  );
}
