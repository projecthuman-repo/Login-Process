import { verifyUser } from "../services/verification";
import { React } from "react";
import { useSearchParams } from "react-router-dom";

export default function Verification() {
  const [searchParams, setSearchParams] = useSearchParams();
  let token = searchParams.get("token");
  console.log(token);
  verifyUser(token)
    .then((data) => {
      console.log(data);
    })
    .catch((err) => {
      console.log(err);
    });
  return (
    <p>
      Check your email for your verification link, click{" "}
      <a href="resendEmailLink">here</a> to resend email{" "}
    </p>
  );
}