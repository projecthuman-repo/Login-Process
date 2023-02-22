import { useFormik } from "formik";
import { schema } from "./../schemas/resetPassSchema";
import { React, useState } from "react";
import { Form, Button } from "react-bootstrap";

export default function ResetPasswordForm() {
  const onSubmit = (values, actions) => {};
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
            type="confirmPassword"
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
        <Button disabled={isSubmitting} variant="primary" type="submit">
          Reset Password
        </Button>
      </Form>
    </div>
  );
}
