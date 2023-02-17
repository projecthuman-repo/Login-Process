import { React, useState } from "react";
import { Form, Button } from "react-bootstrap";
import "react-phone-number-input/style.css";
import { registerUser } from "./../services/registration";
import PhoneInput from "react-phone-number-input";

export default function RegistrationForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [register, setRegister] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      registerUser({
        email: email,
        password: password,
        phoneNumber: phoneNumber,
        firstName: firstName,
        lastName: lastName,
        username: username,
      });
      setFirstName("");
      setLastName("");
      setUsername("");
      setPassword("");
      setEmail("");
      setPhoneNumber("");
      setRegister(true);
    } catch (err) {
      console.log(err.message);
    }
  };
  return (
    <div>
      <h2>Register</h2>
      <Form onSubmit={(e) => handleSubmit(e)}>
        {/* email */}
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
          />
        </Form.Group>

        {/* password */}
        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
        </Form.Group>

        <Form.Group controlId="formBasicPhoneNumber">
          <Form.Label>Phone Number</Form.Label>
          <PhoneInput
            type="phoneNumber"
            name="phoneNumber"
            value={phoneNumber}
            defaultCountry="CA"
            onChange={setPhoneNumber}
            placeholder="Enter phone number"
          />
        </Form.Group>

        <Form.Group controlId="formBasicUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
          />
        </Form.Group>

        <Form.Group controlId="formBasicFirstName">
          <Form.Label>First Name</Form.Label>
          <Form.Control
            type="firstName"
            name="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First Name"
          />
        </Form.Group>

        <Form.Group controlId="formBasicLastName">
          <Form.Label>Last Name</Form.Label>
          <Form.Control
            type="lastName"
            name="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last Name"
          />
        </Form.Group>

        {/* submit button */}
        <Button
          variant="primary"
          type="submit"
          onClick={(e) => handleSubmit(e)}
        >
          Register
        </Button>
        {register ? (
          <p className="text-success">You are Registered Successfully</p>
        ) : (
          <p className="text-danger"></p>
        )}
      </Form>
    </div>
  );
}
/* 
const RegistrationForm = ({
    handleRegistration,
    firstName,
    lastName,
    username,
    password,
    email,
    phoneNumber,
    setFirstName,
    setLastName,
    setUsername,
    setPassword,
    setEmail,
    setPhoneNumber
}) => {

    return (
        <form onSubmit={handleRegistration}>
            <div>
                first name
                <input
                    type='text'
                    value={firstName}
                    name='FirstName'
                    onChange={({ target }) => setFirstName(target.value)}
                />
            </div>
            <div>
                last name
                <input
                    type='text'
                    value={lastName}
                    name='LastName'
                    onChange={({ target }) => setLastName(target.value)}
                />
            </div>
            <div>
                username
                <input
                    type='text'
                    value={username}
                    name='Username'
                    onChange={({ target }) => setUsername(target.value)}
                />
            </div>
            <div>
                password
                <input
                    type='password'
                    value={password}
                    name='Password'
                    onChange={({ target }) => setPassword(target.value)}
                />
            </div>
            <div>
                email
                <input
                    type='email'
                    value={email}
                    name='Email'
                    onChange={({ target }) => setEmail(target.value)}
                />
            </div>
            <div>
                <PhoneInput
                    placeholder='phone number'
                    value={phoneNumber}
                    name='PhoneNumber'
                    onChange={setPhoneNumber}
                />
            </div>
            <button type='submit'>register</button>
        </form>
    ) */
/* } */

/* export default RegistrationForm */
