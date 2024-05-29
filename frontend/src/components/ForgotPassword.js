import { useFormik } from "formik";
import { schema } from "./../schemas/forgotPassSchema";
import { React, useState } from "react";
import { Form, Button } from "react-bootstrap";
import { forgotPassword } from "./../services/forgotPassword";
import "../styles/resetpassword.css";
import "../styles/font.css";

// Component for forgot password page

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
    <div className="resetpassword-page">
      <h2>Reset Password</h2>
      <Form onSubmit={handleSubmit}>
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
          {/* Display errors */}
        </Form.Group>
        {errors.email && touched.email ? (
          <p className="required-message">{errors.email}</p>
        ) : (
          ""
        )}
        {/* submit button */}
        <div className="submit-button-container">
        <Button className="submit-button" variant="primary" type="submit">
          Send Link
        </Button>
        </div>
      </Form>
      {forgotPassError !== null ? (
        <div>
          {forgotPassError.map((error) => (
            <p className="error-message">{error}</p>
          ))}
        </div>
      ) : (
        <p className="success-message"></p>
      )}
      {/* Display message to let user know to check email for reset password link after successfuly filling form */}
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
