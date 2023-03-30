import { useFormik } from "formik";
import { schema } from "./../schemas/resetPassSchema";
import { React, useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import { resetPassword } from "./../services/resetPassword";
import { useNavigate } from "react-router-dom";
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
    <div>
      <h2>Reset Password</h2>
      <Form onSubmit={handleSubmit}>
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

        <Form.Group controlId="formConfirmBasicPassword">
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
        {/* submit button */}
        <Button variant="primary" type="submit">
          Reset Password
        </Button>
      </Form>
      {resetError !== null ? (
        <div>
          {resetError.map((error) => (
            <p className="text-danger">{error}</p>
          ))}
        </div>
      ) : (
        <p className="text-success"></p>
      )}
      {successResetPass ? (
        <p className="text-success">Successfully reset password!</p>
      ) : (
        <p></p>
      )}
    </div>
  );
}
