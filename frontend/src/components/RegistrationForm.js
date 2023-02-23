import { React, useState } from "react";
import { Form, Button } from "react-bootstrap";
import "react-phone-number-input/style.css";
import { registerUser } from "./../services/registration";
import PhoneInput from "react-phone-number-input";
import { useFormik } from "formik";
import { schema } from "./../schemas/registrationSchema";
import { useNavigate } from "react-router-dom";
export default function RegistrationForm() {
  const [registrationError, setRegistrationError] = useState(null);
  const navigate = useNavigate();
  //add backend method to check if user exists before allowing registration
  const [phoneNumber, setPhoneNumber] = useState("");
  const onSubmit = (values, actions) => {
    registerUser({
      email: values.email,
      password: values.password,
      phoneNumber: values.phoneNumber,
      firstName: values.firstName,
      lastName: values.lastName,
      username: values.username,
    })
      .then((data) => {
        actions.resetForm();
        setPhoneNumber("");
        console.log("Successfully registered user ", data);
        /*         window.setTimeout(() => {
          navigate("/");
        }, 1500); */
      })
      .catch((err) => {
        //actions.resetForm();
        setPhoneNumber("");
        setRegistrationError(err.response.data.error.split("\n"));
        //console.log(registrationError);
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

  if (phoneNumber !== "") values.phoneNumber = phoneNumber;

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
            isInvalid={errors.password && touched.password ? true : false}
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
        <div>
          <p>
            By signing up you agree to our <a href="/terms">terms</a>,
            <a href="/privacyPolicy">privacyPolicy</a> and
            <a href="/privacyPolicy"> cookiePolicy</a>
          </p>
        </div>
        {/* submit button */}
        <Button variant="primary" type="submit">
          Register
        </Button>
        {registrationError !== null ? (
          <div>
            {registrationError.map((error) => (
              <p className="text-danger">{error}</p>
            ))}
          </div>
        ) : (
          <p className="text-success"></p>
        )}
      </Form>

      <p>
        Have an account? <a href="/">Login</a>
      </p>
    </div>
  );
}
