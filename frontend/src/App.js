//import registrationService from './services/registration'
/* import loginService from "./services/login"; */
import LoginForm from "./components/LoginForm";
//import Notification from "./components/Notification";
import RegistrationForm from "./components/RegistrationForm";
//import Navigation from "./components/Navigation";
import ForgotPassword from "./components/ForgotPassword";
import { Col, Row } from "react-bootstrap";
import { Routes, Route } from "react-router-dom";
const App = () => {
  return (
    <div>
      <Routes>
        <Route exact path="/register" element={<RegistrationForm />}></Route>
        <Route exact path="/" element={<LoginForm />}></Route>
        <Route exact path="/resetPassword" element={<ForgotPassword />}></Route>
      </Routes>
    </div>
  );
};

export default App;
