import { useFormik } from "formik";
import { schema } from "./../schemas/resetPassSchema";
import { React, useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import { resetPassword } from "./../services/resetPassword";
import { useNavigate } from "react-router-dom";
import "../styles/ResetPassword.css";
import "../styles/Font.css";

// Component for Reset Password Page

export default function ResetPasswordForm() {
  // Hooks
  const [resetError, setResetError] = useState(null);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [successResetPass, setSuccessResetPass] = useState(false);
  // Get reset password token from query params
  let resetToken = searchParams.get("resetToken");
  // Handle submit
  const onSubmit = (values, actions) => {
    resetPassword(resetToken, { password: values.password })
      .then((result) => {
        actions.resetForm();
        setResetError(null);
        setSuccessResetPass(true);
        // Go to login screen
        navigate("/");
      })
      .catch((err) => {
        console.log(err);
        setResetError(err.response.data.error.split("\n"));
      });
  };

  // Formik for validation
  const { values, errors, handleBlur, touched, handleChange, handleSubmit } =
    useFormik({
      initialValues: {
        password: "",
        confirmPassword: "",
      },
      validationSchema: schema,
      onSubmit,
    });

  return (
    <div className="reset-password-page">
      <h2 className="main-heading">Reset Password</h2>
      {/*TODO: Replace *EMAIL* with the email that requested the reset password link.*/}
      <p className="rp-sub-text">Enter a new password for *EMAIL* below.</p>
      <Form onSubmit={handleSubmit}>
        {/*Password*/}
        <Form.Group controlId="formBasicPassword">
          <Form.Control
            className="input-field"
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
          <p className="required-message">{errors.password}</p>
        ) : (
          ""
        )}

        {/*Confirm Password*/}
        <Form.Group controlId="formConfirmBasicPassword">
          <Form.Control
            className="input-field"
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
          <p className="required-message">{errors.confirmPassword}</p>
        ) : (
          ""
        )}

        {/*Reset Button*/}
        <div className="button-container">
        <Button className="reset-button" variant="primary" type="submit">
          Reset Password
        </Button>
        </div>
      </Form>

      {/*Errors*/}
      {resetError !== null ? (
        <div>
          {resetError.map((error) => (
            <p className="error-message">{error}</p>
          ))}
        </div>
      ) : (
        <p className="success-message"></p>
      )}

      {/*Success - Password Reset*/}
      {successResetPass ? (
        <p className="success-message">Successfully reset password! Redirecting to login...</p>
      ) : (
        <p></p>
      )}
    </div>
  );
}
