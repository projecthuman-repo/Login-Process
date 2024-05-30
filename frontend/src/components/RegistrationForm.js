import { React, useState, useRef } from "react";
import { Form, Button } from "react-bootstrap";
import "react-phone-number-input/style.css";
import { registerUser } from "./../services/registration";
import PhoneInput from "react-phone-number-input";
import { useFormik } from "formik";
import { schema } from "./../schemas/registrationSchema";
import { resendVerificationLink } from "./../services/resendVerificationLink";
// import ReCAPTCHA from "react-google-recaptcha";
import { verifyCaptcha } from "../services/verifyCaptcha";
import { useSearchParams } from "react-router-dom";
import "../styles/registration.css";
import "../styles/font.css";

// Component for Registration Page

export default function RegistrationForm() {
    // Hooks
    const [registrationError, setRegistrationError] = useState(null);
    const captchaRef = useRef(null);
    const [hasRegistered, setHasRegistered] = useState(false);
    const [user, setUser] = useState(null);
    const [emailToken, setEmailToken] = useState(null);
    const [buttonOn, setButtonOn] = useState(false);
    const [params] = useSearchParams();
    // Only allow registration button to be clickable provided captcha is filled out
    function turnButtonOn() {
        setButtonOn(true);
    }
    // Function to resend verification link after registration
    function resendLink() {
        resendVerificationLink(user, emailToken)
            .then((data) => {
                console.log(user);
                console.log(emailToken);
                console.log(data);
            })
            .catch((err) => {
                console.log(err);
            });
    }
    // Handle submission
    const onSubmit = (values, actions) => {
        const token = captchaRef.current.getValue();
        console.log(token);
        verifyCaptcha(token)
            .then((data) => {
                console.log(data);
            })
            .catch((err) => {
                console.log(err);
            });
        captchaRef.current.reset();
        registerUser({
            email: values.email,
            password: values.password,
            phoneNumber: values.phoneNumber,
            firstName: values.firstName,
            lastName: values.lastName,
            username: values.username,
            appId: params.get("appId"),
        })
            .then((data) => {
                // Clear form
                actions.resetForm();
                setRegistrationError(null);
                setHasRegistered(true);
                setUser(data.savedUser);
                setEmailToken(data.emailToken);
            })
            .catch((err) => {
                setRegistrationError(err.response.data.error.split("\n"));
            });
    };

    // Use Formik to handle validation

    const { values, errors, handleBlur, touched, handleChange, handleSubmit } =
        useFormik({
            initialValues: {
                email: "",
                password: "",
                firstName: "",
                lastName: "",
                username: "",
            },
            validationSchema: schema,
            onSubmit,
        });

    return (
        <div className="registration-body">
        <div className="registration-page">
            <h2 className="main-heading">Sign up for a Project: Human City account.</h2>
            <div className="social-button-container">
                <Button className="social-button">
                    <img src="SocialMedia/facebook.png" alt="Facebook" />
                </Button>
                <Button className="social-button">
                    <img src="SocialMedia/x.svg" alt="X" />
                </Button>
                <Button className="social-button">
                    <img src="SocialMedia/instagram.png" alt="Instagram" />
                </Button>
                <Button className="social-button">
                    <img src="SocialMedia/google.png" alt="Google" />
                </Button>
            </div>
            <div className="line-container">
                <div className="line"></div>
                <p>&nbsp;&nbsp;Or Sign Up With&nbsp;&nbsp;</p>
                <div className="line"></div>
            </div>
            <Form className="form-container" onSubmit={handleSubmit}>
                {/* First Name */}
                <Form.Group controlId="formBasicFirstName">
                    <Form.Control
                        className="input-field"
                        type="firstName"
                        name="firstName"
                        value={values.firstName}
                        onChange={handleChange}
                        placeholder="First Name"
                        onBlur={handleBlur}
                        isInvalid={
                            errors.firstName && touched.firstName ? true : false
                        }
                    />
                </Form.Group>
                {errors.firstName && touched.firstName ? (
                    <p className="required-message">{errors.firstName}</p>
                ) : (
                    ""
                )}
                {/* Last Name */}
                <Form.Group controlId="formBasicLastName">
                    <Form.Control
                        className="input-field"
                        type="lastName"
                        name="lastName"
                        value={values.lastName}
                        onChange={handleChange}
                        placeholder="Last Name"
                        onBlur={handleBlur}
                        isInvalid={
                            errors.lastName && touched.lastName ? true : false
                        }
                    />
                </Form.Group>
                {errors.lastName && touched.lastName ? (
                    <p className="required-message">{errors.lastName}</p>
                ) : (
                    ""
                )}
                {/* Email */}
                <Form.Group controlId="formBasicEmail">
                    <Form.Control
                        className="input-field"
                        type="email"
                        name="email"
                        value={values.email}
                        onChange={handleChange}
                        placeholder="Email"
                        onBlur={handleBlur}
                        isInvalid={errors.email && touched.email ? true : false}
                    />
                </Form.Group>
                {errors.email && touched.email ? (
                    <p className="required-message">{errors.email}</p>
                ) : (
                    ""
                )}
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
                {/* Policy Warnings */}
                <div>
                    <p className="sub-text">
                        By signing up for a Project: Human City account you agree to our{" "}
                        <a href="/terms">Terms of Use</a>,{" "}
                        <a href="/privacyPolicy">Privacy Policy</a> and{" "}
                        <a href="/privacyPolicy"> Cookie Policy</a>.
                    </p>
                </div>
               {/* Submit Button */}
               {/* <ReCAPTCHA
                    sitekey={process.env.REACT_APP_SITE_KEY}
                    ref={captchaRef}
                    onChange={turnButtonOn}
                /> */}
                <div className="submit-button-container">
                    <Button className="submit-button" disabled={!buttonOn} variant="primary" type="submit">
                        Register
                    </Button>
                </div>
            </Form>
            {registrationError !== null ? (
                <div>
                    {registrationError.map((error) => (
                        <p className="error-message">{error}</p>
                    ))}
                </div>
            ) : (
                <p></p>
            )}
            {/* If registration successful, verify account using email sent to user's email address, can also click button to resend link */}
            {hasRegistered ? (
                <div>
                    {" "}
                    <p className="success-message">
                        Succesfully registered account, please verify your account using the email sent to you!
                    </p>
                    <Button
                        variant="primary"
                        type="submit"
                        onClick={() => resendLink()}
                    >
                        Resend verification link
                    </Button>
                </div>
            ) : (
                <p></p>
            )}
            {/* Link to login */}
            <p className="sub-text">
                Already have an account? <a href="/">Log In!</a>
            </p>
        </div>
        </div>
    );
}
