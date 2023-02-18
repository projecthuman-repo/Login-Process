/* const LoginForm = ({ handleLogin, username, password, setUsername, setPassword }) => {
    return (
        <form onSubmit={handleLogin}>
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
            <button type='submit'>login</button>
        </form>
    )
} */
import { useFormik } from "formik";
import { schema } from "./../schemas/loginSchema";
import { React, useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import { login } from "./../services/login";
import jwt_decode from "jwt-decode";
import Cookies from "universal-cookie";
const cookies = new Cookies();
export default function LoginForm() {
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
  //const [register, setRegister] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const onSubmit = (values, actions) => {
    login({
      password: values.password,
      username: values.username,
      /*   confirmPassword: values.confirmPassword, */
    })
      .then((data) => {
        actions.resetForm();
        console.log("TOKENNNNNN", data.token);
        cookies.set("TOKEN", data.token, {
          path: "/",
        });
        window.location.href = "/auth";
      })
      .catch((err) => {});
  };
  const {
    values,
    errors,
    handleBlur,
    isSubmitting,
    touched,
    handleChange,
    handleSubmit,
  } = useFormik({
    initialValues: {
      password: "",
      username: "",
    },
    validationSchema: schema,
    onSubmit,
  });

  /*  const handleSubmit = (e) => {
      e.preventDefault();
      try {
        registerUser({
          email: values.email,
          password: values.password,
          phoneNumber: values.phoneNumber,
          firstName: values.firstName,
          lastName: values.lastName,
          username: values.username,
        });
        /*       setFirstName("");
        setLastName("");
        setUsername("");
        setPassword("");
        setEmail("");
        setPhoneNumber(""); */
  /* setRegister(true); */
  /*  } catch (err) {
        console.log(err.message);
      }
    };  */

  return (
    <div>
      <h2>Login</h2>

      <Form.Group controlId="formBasicUsername">
        <Form.Label>Username</Form.Label>
        <Form.Control
          type="username"
          name="username"
          value={values.username}
          onChange={handleChange}
          placeholder="Username"
          onBlur={handleBlur}
          isInvalid={errors.username && touched.username ? true : false}
        />
      </Form.Group>
      {errors.username && touched.username ? (
        <p className="text-danger">{errors.username}</p>
      ) : (
        ""
      )}
      <Form onSubmit={handleSubmit}>
        {/* password */}
        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            value={values.password}
            onChange={handleChange}
            placeholder="Password"
            onBlur={handleBlur}
            isInvalid={errors.password && touched.password ? true : false}
          />
        </Form.Group>
        {errors.password && touched.password ? (
          <p className="text-danger">{errors.password}</p>
        ) : (
          ""
        )}
        {/* submit button */}
        <Button disabled={isSubmitting} variant="primary" type="submit">
          Login
        </Button>
      </Form>
      <div id="signInDiv"> {/* make this a component later? */}</div>
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
