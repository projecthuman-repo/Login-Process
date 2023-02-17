import { useState, useEffect } from "react";
import jwt_decode from "jwt-decode";
//import registrationService from './services/registration'
import loginService from "./services/login";
import LoginForm from "./components/LoginForm";
import Notification from "./components/Notification";
import RegistrationForm from "./components/RegistrationForm";

const App = () => {
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  /*  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [registrationUsername, setRegistrationUsername] = useState("");
  const [registrationPassword, setRegistrationPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState(""); */
  const [errorMessage, setErrorMessage] = useState(null);
  const [user, setUser] = useState(null);

  const handleCallbackResponse = (response) => {
    const userInfo = jwt_decode(response.credential);
    console.log(userInfo);

    const user = {
      firstName: userInfo.given_name,
      lastName: userInfo.family_name,
      registrationUsername: userInfo.email,
      email: userInfo.email,
      // we need something to add phone number
      // pfpLink: userInfo.picture - optional
    };
    // setUser(user) - immediate sign in
  };

  useEffect(() => {
    /* global google */
    google.accounts.id.initialize({
      client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
      callback: handleCallbackResponse,
    });

    google.accounts.id.renderButton(document.getElementById("signInDiv"), {
      theme: "outline",
      size: "large",
    });
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({
        loginUsername,
        loginPassword,
      });
      setUser(user);
      setLoginUsername("");
      setLoginPassword("");
    } catch (exception) {
      setErrorMessage("Wrong Credentials");
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  /*  const handleRegistration = async (event) => {
    event.preventDefault();
    try {
      const response = await registrationService.register({
        firstName,
        lastName,
        registrationUsername,
        registrationPassword,
        email,
        phoneNumber,
      });
      setFirstName("");
      setLastName("");
      setRegistrationUsername("");
      setRegistrationPassword("");
      setEmail("");
      setPhoneNumber("");
    } catch (exception) {
      setErrorMessage("Some fields are incomplete or have errors"); // not very user-friendly, make more verbose in future
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };
 */
  return (
    <div>
      {user === null ? (
        <div>
          <div>
            <Notification message={errorMessage} />
            <h1>Login</h1>
            <LoginForm
              handleLogin={handleLogin}
              username={loginUsername}
              password={loginPassword}
              setUsername={setLoginUsername}
              setPassword={setLoginPassword}
            />
            <div id="signInDiv"> {/* make this a component later? */}</div>
          </div>
          <hr />
          <div>
            <RegistrationForm
            /*  handleRegistration={handleRegistration}
              firstName={firstName}
              lastName={lastName}
              username={registrationUsername}
              password={registrationPassword}
              email={email}
              phoneNumber={phoneNumber}
              setFirstName={setFirstName}
              setLastName={setLastName}
              setUsername={setRegistrationUsername}
              setPassword={setRegistrationPassword}
              setEmail={setEmail}
              setPhoneNumber={setPhoneNumber} */
            />
          </div>
        </div>
      ) : (
        <div>
          <p>hello {user.firstName}</p>
        </div>
      )}
    </div>
  );
};

export default App;
