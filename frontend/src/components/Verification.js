import { verifyUser } from "../services/verification";
import { React, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
export default function Verification() {
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
      // setVerifyError(err.response.data.error.split("\n"));
    });
  return (
    <div>
      {" "}
      <p>
        Check your email for your verification link, click{" "}
        <a href={`http://localhost:3000/verification/?token=${token}`}>here</a>{" "}
        to resend email{" "}
      </p>
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
