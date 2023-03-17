import { useFormik } from "formik";
import { schema } from "./../schemas/loginSchema";
import { React, useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import { login } from "./../services/login";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
export default function LoginForm() {
  const [loginError, setLoginError] = useState(null);
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState("");
  const onSubmit = (values, actions) => {
    login({
      password: values.password,
      username: values.username,
    })
      .then((data) => {
        actions.resetForm();
        const token = data.token;
        localStorage.setItem("token", token);
        const expiration = new Date();
        expiration.setMinutes(expiration.getMinutes() + 60);
        localStorage.setItem("expiration", expiration.toISOString());
        console.log("Successfully logged in user ", data);
        setLoginError(null);
        navigate("/homepage");
      })
      .catch((err) => {
        setLoginError(err.response.data.error.split("\n"));
        //  actions.resetForm();
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
        <Button variant="primary" type="submit">
          Login
        </Button>
      </Form>
      {loginError !== null ? (
        <div>
          {loginError.map((error) => (
            <p className="text-danger">{error}</p>
          ))}
        </div>
      ) : (
        <p className="text-success"></p>
      )}
      <div id="signInDiv"></div>
      <div>
        <a href="/forgotPassword">Forgot Password?</a>
      </div>
      <div>
        <a href="/register">Don't have an account? Sign up</a>
      </div>
      <GoogleLogin
        onSuccess={(credentialResponse) => {
          console.log(credentialResponse);
        }}
        onError={() => {
          console.log("Login Failed");
        }}
      />
      ;
    </div>
  );
}
