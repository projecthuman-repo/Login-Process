import { React, useState } from "react";
import { Form, Button } from "react-bootstrap";
import "react-phone-number-input/style.css";
import { registerUser } from "./../services/registration";
import PhoneInput from "react-phone-number-input";
import { useFormik } from "formik";
import { schema } from "./../schemas/registrationSchema";

export default function RegistrationForm() {
  const onSubmit = (values, actions) => {
    try {
      registerUser({
        email: values.email,
        password: values.password,
        phoneNumber: phoneNumber,
        firstName: values.firstName,
        lastName: values.lastName,
        username: values.username,
        /*   confirmPassword: values.confirmPassword, */
      });
      actions.resetForm();
    } catch (exception) {}
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
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      username: "",
      phoneNumber: "",
      confirmPassword: "",
    },
    validationSchema: schema,
    onSubmit,
  });

  const [register, setRegister] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
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
      <h2>Register</h2>
      <Form onSubmit={handleSubmit}>
        {/* email */}
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={values.email}
            onChange={handleChange}
            placeholder="Enter email"
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
            isInvalid={errors.password && touched.password ? true : false}
          />
        </Form.Group>
        {errors.password && touched.password ? (
          <p className="text-danger">{errors.password}</p>
        ) : (
          ""
        )}

        <Form.Group controlId="formBasicConfirmPassword">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            name="confirmPassword"
            value={values.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm Password"
            onBlur={handleBlur}
            isInvalid={
              errors.confirmPassword && touched.confirmPassword ? true : false
            }
          />
        </Form.Group>
        {errors.confirmPassword && touched.confirmPassword ? (
          <p className="text-danger">{errors.confirmPassword}</p>
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
            placeholder="Enter phone number"
            onBlur={handleBlur}
            /*    isInvalid={
              errors.phoneNumber && touched.confirmPassword ? true : false
            } */
          />
        </Form.Group>
        {errors.phoneNumber && touched.phoneNumber ? (
          <p className="text-danger">{errors.phoneNumber}</p>
        ) : (
          ""
        )}

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

        <Form.Group controlId="formBasicFirstName">
          <Form.Label>First Name</Form.Label>
          <Form.Control
            type="firstName"
            name="firstName"
            value={values.firstName}
            onChange={handleChange}
            placeholder="First Name"
            onBlur={handleBlur}
            isInvalid={errors.firstName && touched.firstName ? true : false}
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
            isInvalid={errors.lastName && touched.lastName ? true : false}
          />
        </Form.Group>
        {errors.lastName && touched.lastName ? (
          <p className="text-danger">{errors.lastName}</p>
        ) : (
          ""
        )}

        {/* submit button */}
        <Button disabled={isSubmitting} variant="primary" type="submit">
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
