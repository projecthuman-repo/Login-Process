import { verifyUser } from "../services/verification";
import { React, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
export default function Verification() {
  // Hooks
  const [searchParams, setSearchParams] = useSearchParams();
  const [verifyError, setVerifyError] = useState(null);
  const navigate = useNavigate();
  let token = searchParams.get("token");
  console.log(token);
  verifyUser(token)
    .then((data) => {
      console.log(data);
      navigate("/");
    })
    .catch((err) => {
      console.log(err);
      alert(err.response.data.error.split("\n"));
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
