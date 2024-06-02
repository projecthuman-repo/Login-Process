import { React, useState, useRef } from "react";
import { Form, Button } from "react-bootstrap";
import "../styles/Privacy.css";
import "../styles/Font.css";

// Component for Privacy Page

export default function Privacy() {
    // Hooks
    const [validPhoneNumber, setValidPhoneNumber] = useState(false);

    return (
        <div className="privacy-body">
                {validPhoneNumber ? (
                    <div className="privacy-page">
                        <h2 className="main-heading">Improve your privacy.</h2>
                        <h3 className="sub-heading">Opt in to 2 factor authentication to ensure your account is secure.</h3>
                        <p className="sub-text">A 4-digit code will be sent to your phone number when signing in.</p>
                        <Form className="form-container">
                            {/* Phone Number */}
                            <Form.Group controlId="formBasicFirstName">
                                <Form.Control
                                    className="input-field"
                                    type="firstName"
                                    name="firstName"
                                    placeholder="Phone Number"
                                />
                            </Form.Group>
                        </Form>
                        <div className="button-container">
                            <Button className="nav-buttons" variant="primary" type="submit">
                                Submit
                            </Button>
                            <Button className="nav-buttons" variant="primary" type="submit">
                                Skip
                            </Button>
                        </div>
                    </div>
                    ) : (
                    <div className="privacy-page">
                        <h2 className="main-heading">Improve your privacy.</h2>
                        <h3 className="sub-heading">Opt in to 2 factor authentication to ensure your account is secure.</h3>
                        <p className="sub-text">Enter the 4-digit code sent your phone number.</p>
                        <Form className="form-container">
                            {/*Phone Number*/}
                            <Form.Group controlId="formBasicFirstName">
                                <Form.Control
                                    className="input-field"
                                    type="firstName"
                                    name="firstName"
                                    placeholder="4-digit Code"
                                />
                            </Form.Group>
                        </Form>
                        <div className="button-container">
                            <Button className="nav-buttons" variant="primary" type="submit">
                                Submit
                            </Button>
                            <Button className="nav-buttons" variant="primary" type="submit">
                                Skip
                            </Button>
                        </div>
                    </div>              
                )}
        </div>
    );
}