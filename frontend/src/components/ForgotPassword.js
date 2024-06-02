import { useFormik } from "formik";
import { schema } from "./../schemas/forgotPassSchema";
import { React, useState } from "react";
import { Form, Button } from "react-bootstrap";
import { forgotPassword } from "./../services/forgotPassword";
import "../styles/ForgotPassword.css";
import "../styles/Font.css";

// Component for Forgot Password Page

export default function ForgotPasswordForm() {
  // Hooks
  const [forgotPassError, setForgotPassError] = useState(null);
  const [successForgetPass, setSuccessForgetPass] = useState(false);
  /**
   * Handle submission of forgot password form
   * @param {object} values
   * @param {Object} actions
   */
  const onSubmit = (values, actions) => {
    forgotPassword({ email: values.email })
      .then((result) => {
        // Empty form fields
        actions.resetForm();
        // Show no errors
        setForgotPassError(null);
        setSuccessForgetPass(true);
      })
      .catch((err) => {
        setForgotPassError(err.response.data.error.split("\n"));
      });
  };
  /**
   * Using formik for validation and to assist with form validation
   */
  const { values, errors, handleBlur, touched, handleChange, handleSubmit } =
    useFormik({
      initialValues: {
        email: "",
      },
      validationSchema: schema,
      onSubmit,
    });

  return (
    <div className="forgot-password-page">
      <h2>Forgot Password</h2>
      <Form onSubmit={handleSubmit}>
        {/*Email*/}
        <Form.Group controlId="formBasicemail">
          <Form.Control
            className="input-field"
            type="email"
            name="email"
            value={values.email}
            onChange={handleChange}
            placeholder="Email"
            onBlur={handleBlur}
            // Check if there are errors in field input and if so display errors
            isInvalid={errors.email && touched.email ? true : false}
          />
        </Form.Group>
        {errors.email && touched.email ? (
          <p className="required-message">{errors.email}</p>
        ) : (
          ""
        )}

        {/*Submit Button*/}
        <div className="button-container">
          <Button className="link-button" variant="primary" type="submit">
            Send Link
          </Button>
        </div>
      </Form>

      {/*Errors*/}
      {forgotPassError !== null ? (
        <div>
          {forgotPassError.map((error) => (
            <p className="error-message">{error}</p>
          ))}
        </div>
      ) : (
        <p className="success-message"></p>
      )}

      {/*Success -  Email Sent*/}
      {successForgetPass ? (
        <p className="success-message">
          Sent! Check your email for a reset password link.
        </p>
      ) : (
        <p></p>
      )}
    </div>
  );
}
