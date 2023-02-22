import { useFormik } from "formik";
import { schema } from "./../schemas/loginSchema";
import { React, useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import { login } from "./../services/login";
import jwt_decode from "jwt-decode";
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
  const [phoneNumber, setPhoneNumber] = useState("");
  const onSubmit = (values, actions) => {
    login({
      password: values.password,
      username: values.username,
    })
      .then((data) => {
        actions.resetForm();
        window.location.href = "/auth";
        console.log("Successfully logged in user ", data);
      })
      .catch((err) => {
        console.log(err);
      });
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

  return (
    <div>
      <h2>Login</h2>
      <Form onSubmit={handleSubmit}>
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
        <div>
          <a href="/resetPassword">Forgot Password?</a>
        </div>
        <div>
          <a href="/register">Don't have an account? Sign up</a>
        </div>
      </Form>
    </div>
  );
}
