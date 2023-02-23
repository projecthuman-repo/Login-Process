//import registrationService from './services/registration'
/* import loginService from "./services/login"; */
import LoginForm from "./components/LoginForm";
//import Notification from "./components/Notification";
import RegistrationForm from "./components/RegistrationForm";
//import Navigation from "./components/Navigation";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import Verification from "./components/Verification";
import { Routes, Route } from "react-router-dom";
const App = () => {
  return (
    <div>
      <Routes>
        <Route exact path="/register" element={<RegistrationForm />}></Route>
        <Route exact path="/" element={<LoginForm />}></Route>
        <Route
          exact
          path="/forgotPassword"
          element={<ForgotPassword />}
        ></Route>
        <Route exact path="/resetPassword" element={<ResetPassword />}></Route>
        <Route exact path="/Verification" element={<Verification />}></Route>
      </Routes>
    </div>
  );
};

export default App;
