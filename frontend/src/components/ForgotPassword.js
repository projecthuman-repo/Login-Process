import { useFormik } from "formik";
import { schema } from "./../schemas/forgotPassSchema";
import { React, useState } from "react";
import { Form, Button } from "react-bootstrap";
import { forgotPassword } from "./../services/forgotPassword";

export default function ForgotPasswordForm() {
  const [forgotPassError, setForgotPassError] = useState(null);
  const [successForgetPass, setSuccessForgetPass] = useState(false);
  const onSubmit = (values, actions) => {
    forgotPassword({ email: values.email })
      .then((result) => {
        console.log(result);
        actions.resetForm();
        setForgotPassError(null);
        setSuccessForgetPass(true);
      })
      .catch((err) => {
        setForgotPassError(err.response.data.error.split("\n"));
        // actions.resetForm();
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
        <Button variant="primary" type="submit">
          Get Reset Password Link
        </Button>
      </Form>
      {forgotPassError !== null ? (
        <div>
          {forgotPassError.map((error) => (
            <p className="text-danger">{error}</p>
          ))}
        </div>
      ) : (
        <p className="text-success"></p>
      )}
      {successForgetPass ? (
        <p className="text-success">
          Check your email for a reset password link
        </p>
      ) : (
        <p></p>
      )}
    </div>
  );
}
