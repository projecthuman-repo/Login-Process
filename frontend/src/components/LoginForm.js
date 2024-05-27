import { useFormik } from "formik";
import { schema } from "./../schemas/loginSchema";
import { React, useState } from "react";
import { Form, Button } from "react-bootstrap";
import { login } from "./../services/login";
import { useNavigate } from "react-router-dom";
// import { useGoogleLogin } from "@react-oauth/google";
// import { addGoogleUser } from "../services/addGoogleUser";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import "../styles/login.css";
import "../styles/font.css";

// Component for login page

export default function LoginForm() {
    // Hooks
    const [loginError, setLoginError] = useState(null);
    const [params] = useSearchParams();
    const navigate = useNavigate();
    // Google login
    //const googleLogin = useGoogleLogin({
    //    onSuccess: (codeResponse) => {
    //        const user = codeResponse;
    //        const token = user.access_token;
            // Set token and expiration data of token
    //        localStorage.setItem("token", token);
    //        const expiration = new Date();
    //        expiration.setMinutes(expiration.getMinutes() + 60);
    //        localStorage.setItem("expiration", expiration.toISOString());
            // Send request to google api to verify if login was successful and get user info
    //        axios
    //            .get(
    //                `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${token}`,
    //                {
    //                    headers: {
    //                        Authorization: `Bearer ${token}`,
    //                        Accept: "application/json",
    //                    },
    //                }
    //            )
    //            .then((res) => {
    //                // Profile contains user data
    //                const profile = res.data;
    //                // Add google user into database
    //                addGoogleUser({
    //                    firstName: profile.given_name,
    //                    lastName: profile.family_name,
    //                    email: profile.email,
    //                })
    //                    .then((data) => {
    //                        console.log(data);
    //                    })
    //                    .catch((e) => {
    //                        console.log(e);
    //                    });
    //            })
    //            .catch((err) => console.log(err));
            // Go to homepage on successfuly login
    //        navigate("/homepage");
    //    },
    //    onError: (error) => setLoginError("Login failed: ", error),
    //});
    // Handle form submission
    const onSubmit = (values, actions) => {
        axios
            .post("/api/login", {
                username: values.username,
                password: values.password,
                appId: params.get("appId")
            })
            .then((response) => {
                actions.resetForm();
                const token = response.data.token;
                // Set token and expiration time/data of token
                localStorage.setItem("token", token);
                const expiration = new Date();
                expiration.setMinutes(expiration.getMinutes() + 60);
                localStorage.setItem("expiration", expiration.toISOString());
                console.log("Successfully logged in user ", response.data);
                setLoginError(null);
    //            navigate("/homepage");
            })
            .catch((err) => {
                console.log(err); // Log the error object to the console
                if (
                    err.response &&
                    err.response.data &&
                    err.response.data.error
                ) {
                    setLoginError(err.response.data.error);
                } else {
                    setLoginError("An error occurred during login.");
                }
                actions.resetForm();
            });
    };
    // Formik for form validation
    const { values, errors, handleBlur, touched, handleChange, handleSubmit } =
        useFormik({
            initialValues: {
                password: "",
                username: "",
            },
            validationSchema: schema,
            onSubmit,
        });

    return (
        <div className="login-page"> 
            <h2 className="main-heading">Log in to your Project: Human City account.</h2>
                <Form onSubmit={handleSubmit}>
                    {/* Username */}
                    <Form.Group controlId="formBasicUsername">
                        <Form.Control
                            className="input-field"
                            type="username"
                            name="username"
                            value={values.username}
                            onChange={handleChange}
                            placeholder="Username"
                            onBlur={handleBlur}
                            isInvalid={
                                errors.username && touched.username ? true : false
                            }
                        />
                    </Form.Group>
                        {errors.username && touched.username ? (
                            <p className="required-message">{errors.username}</p>
                        ) : (
                            ""
                        )}
                    {/* Password */}
                    <Form.Group controlId="formBasicPassword">
                        <Form.Control
                            className="input-field"
                            type="password"
                            name="password"
                            value={values.password}
                            onChange={handleChange}
                            placeholder="Password"
                            onBlur={handleBlur}
                            isInvalid={
                                errors.password && touched.password ? true : false
                            }
                        />
                    </Form.Group>
                    {errors.password && touched.password ? (
                        <p className="required-message">{errors.password}</p>
                    ) : (
                        ""
                    )}
                    {/* Submit Button */}
                    <div className="submit-button-container">
                    <Button className="submit-button" variant="primary" type="submit">
                        Log In
                    </Button>
                    </div>
                </Form>
            {loginError !== null ? (
                <div>
                    {Array.isArray(loginError) ? (
                        loginError.map((error) => (
                            <p className="error-message sub-text">{error}</p>
                        ))
                    ) : (
                        <p className="error-message sub-text">{loginError}</p>
                    )}
                </div>
            ) : (
                <p className="text-success"></p>
            )}
            <a className="sub-text" href="/forgotPassword">Forgot Password?</a>

            {/* TODO: Fix alignment issues with these buttons to match the rest of the page. */}
            
            {/*<div className="line-container">
                <div class="line"></div>
                <p>&nbsp;&nbsp;Or&nbsp;&nbsp;</p>
                <div class="line"></div>
            </div>
            <div className="social-button-container">
                <Button className="social-button">
                    <img src="google.png" alt="Google" />
                </Button>
                <Button className="social-button">
                    <img src="facebook.png" alt="Google" />
                </Button>
                <Button className="social-button">
                    <img src="x.svg" alt="Google" />
                </Button>
            </div>*/} 

            <div id="signInDiv"></div>
            {/* Link to Sign Up */}
            <p className="sub-text">Don't have an account yet? <a href="/register">Sign Up!</a></p>
        {/*     <Button onClick={() => googleLogin()}>
                Sign in with Google 🚀{" "}
            </Button>*/} 
        </div>
    );
}