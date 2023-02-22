import { useFormik } from "formik";
import { schema } from "./../schemas/forgotPassSchema";
import { React, useState } from "react";
import { Form, Button } from "react-bootstrap";
import { resetToken } from "./../services/resetToken";

export default function ForgotPasswordForm() {
  const onSubmit = (values, actions) => {
    resetToken({ email: values.email })
      .then((result) => {
        console.log(result);
        actions.resetForm();
      })
      .catch((err) => {
        console.log(err);
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
    },
    validationSchema: schema,
    onSubmit,
  });

  return (
    <div>
      <h2>Forgot Password</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formBasicemail">
          <Form.Label>Enter Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={values.email}
            onChange={handleChange}
            placeholder="email"
            onBlur={handleBlur}
            isInvalid={errors.email && touched.email ? true : false}
          />
        </Form.Group>
        {errors.email && touched.email ? (
          <p className="text-danger">{errors.email}</p>
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
