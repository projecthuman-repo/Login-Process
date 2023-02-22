import { useFormik } from "formik";
import { schema } from "./../schemas/forgotPassSchema";
import { React, useState } from "react";
import { Form, Button } from "react-bootstrap";

export default function ForgotPasswordForm() {
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
      username: "",
    },
    validationSchema: schema,
    onSubmit,
  });

  return (
    <div>
      <h2>Forgot Password</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formBasicUsername">
          <Form.Label>Email, Phone or Username</Form.Label>
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
        {/* submit button */}
        <Button disabled={isSubmitting} variant="primary" type="submit">
          Get Reset Password Link
        </Button>
      </Form>
    </div>
  );
}
