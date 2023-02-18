import { useState, useEffect } from "react";

//import registrationService from './services/registration'
/* import loginService from "./services/login"; */
import LoginForm from "./components/LoginForm";
//import Notification from "./components/Notification";
import RegistrationForm from "./components/RegistrationForm";
import AuthComponent from "./components/AuthComponent";
//import Navigation from "./components/Navigation";
import { Container, Col, Row } from "react-bootstrap";
import { Routes, Route } from "react-router-dom";
const App = () => {
  return (
    <div>
      <Row>
        <Col className="text-center">
          <h1>Login System</h1>

          <nav id="navigationFromHome">
            <a href="/login">Login</a>
            <a href="/free">Free Component</a>
            <a href="/auth">Auth Component</a>
            <a href="/register">Registration</a>
          </nav>
        </Col>
      </Row>
      ;
      <Routes>
        {/*   <Route exact path="/" element={<Navigation />}></Route> */}
        <Route exact path="/register" element={<RegistrationForm />}></Route>
        <Route exact path="/login" element={<LoginForm />}></Route>
        <Route exact path="/auth" element={<AuthComponent />}></Route>
      </Routes>
    </div>
  );
};

export default App;
