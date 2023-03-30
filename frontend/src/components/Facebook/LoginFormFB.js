import React from "react";
import FacebookLogin from "react-facebook-login";

function LoginFormFB() {
  const responseFacebook = (response) => {
    console.log(response);
  };

  return (
    <div>
      <h1>Login with Facebook</h1>
      <FacebookLogin
        appId="543595701245981"
        autoLoad={true}
        callback={responseFacebook}
      />
    </div>
  );
}

export default LoginFormFB;
