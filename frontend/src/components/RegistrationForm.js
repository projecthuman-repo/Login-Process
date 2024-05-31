import { React, useState, useRef } from "react";
import { Form, Button } from "react-bootstrap";
import "react-phone-number-input/style.css";
import { registerUser } from "./../services/registration";
import PhoneInput from "react-phone-number-input";
import { useFormik } from "formik";
import { schema } from "./../schemas/registrationSchema";
import { resendVerificationLink } from "./../services/resendVerificationLink";
import ReCAPTCHA from "react-google-recaptcha";
import { verifyCaptcha } from "../services/verifyCaptcha";
import { useSearchParams } from "react-router-dom";
import "../styles/login.css";
import "../styles/font.css";
import "../styles/registration.css"

// Component for registration page

export default function RegistrationForm() {
    // Hooks
    const [registrationError, setRegistrationError] = useState(null);
    const captchaRef = useRef(null);
    const [hasRegistered, setHasRegistered] = useState(false);
    const [user, setUser] = useState(null);
    const [emailToken, setEmailToken] = useState(null);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [buttonOn, setButtonOn] = useState(false);
    const [params] = useSearchParams();
    // Only allow registration button to be clickable provided captcha is filled out
    // function turnButtonOn() {
    //     setButtonOn(true);
    // }
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
                setPhoneNumber("");
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
                phoneNumber: "",
            },
            validationSchema: schema,
            onSubmit,
        });
    // Phone number field is not properly handled by formik
    if (phoneNumber !== "") values.phoneNumber = phoneNumber;

    return (
        <div className="registration-page">
            <h2>Sign Up With Social Media</h2>
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
            <Form onSubmit={handleSubmit}>
                {/* email */}
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
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
                    <p className="text-danger">{errors.email}</p>
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
                        isInvalid={
                            errors.password && touched.password ? true : false
                        }
                    />
                </Form.Group>
                {errors.password && touched.password ? (
                    <p className="text-danger">{errors.password}</p>
                ) : (
                    ""
                )}

                <Form.Group controlId="formBasicPhoneNumber">
                    <Form.Label>Phone Number</Form.Label>
                    <PhoneInput
                        type="phoneNumber"
                        name="phoneNumber"
                        value={phoneNumber}
                        defaultCountry="CA"
                        onChange={setPhoneNumber}
                        placeholder="Phone number"
                        onBlur={handleBlur}
                    />
                </Form.Group>
                {errors.phoneNumber && touched.phoneNumber ? (
                    <p className="text-danger">{errors.phoneNumber}</p>
                ) : (
                    ""
                )}

                <Form.Group controlId="formBasicUsername">
                    <Form.Label className="">Username</Form.Label>
                    <Form.Control
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
                    <p className="text-danger">{errors.username}</p>
                ) : (
                    ""
                )}

                <Form.Group controlId="formBasicFirstName">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
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
                    <p className="text-danger">{errors.firstName}</p>
                ) : (
                    ""
                )}

                <Form.Group controlId="formBasicLastName">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
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
                    <p className="text-danger">{errors.lastName}</p>
                ) : (
                    ""
                )}
                <div>
                    <p className="small-size sub-text">
                        By signing up you agree to our{" "}
                        <a className="link-text" href="/terms">Terms</a>,
                        <a className="link-text"  href="/privacyPolicy">Privacy Policy</a> and
                        <a className="link-text" href="/privacyPolicy"> Cookie Policy</a>
                    </p>
                </div>
                {/* submit button */}
                {/* <ReCAPTCHA
                    sitekey={process.env.REACT_APP_SITE_KEY}
                    ref={captchaRef}
                    onChange={turnButtonOn}
                /> */}
                <Button disabled={!buttonOn} variant="primary" type="submit">
                    Register
                </Button>
            </Form>
            {registrationError !== null ? (
                <div>
                    {registrationError.map((error) => (
                        <p className="text-danger">{error}</p>
                    ))}
                </div>
            ) : (
                <p></p>
            )}
            {/* If registration successful, verify account using email sent to user's email address, can also click button to resend link */}
            {hasRegistered ? (
                <div>
                    {" "}
                    <p className="text-success">
                        Succesfully registered account, please verify your
                        account using the email sent to you!
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
            <p>
                Have an account? <a href="/">Login</a>
            </p>
        </div>
    );
}
