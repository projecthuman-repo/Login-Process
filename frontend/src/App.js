import { useState, useEffect } from "react";

//import registrationService from './services/registration'
/* import loginService from "./services/login"; */
import LoginForm from "./components/LoginForm";
//import Notification from "./components/Notification";
import RegistrationForm from "./components/RegistrationForm";
import AuthComponent from "./components/AuthComponent";

import { Routes, Route } from "react-router-dom";
const App = () => {
  /*   const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState(""); */
  /*  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [registrationUsername, setRegistrationUsername] = useState("");
  const [registrationPassword, setRegistrationPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState(""); */
  /*   const [errorMessage, setErrorMessage] = useState(null);
  const [user, setUser] = useState(null); */

  /*   const handleLogin = async (event) => {
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
 */
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
    <Routes>
      <Route exact path="/register" element={<RegistrationForm />}></Route>
      <Route exact path="/login" element={<LoginForm />}></Route>
      <Route exact path="/auth" element={<AuthComponent />}></Route>
    </Routes>
  );
};

export default App;
