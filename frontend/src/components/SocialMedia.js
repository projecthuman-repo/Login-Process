import { React, useState, useRef } from "react";
import { Form, Button } from "react-bootstrap";
import "../styles/SocialMedia.css";
import "../styles/Font.css";

// Component for Social Media Page

export default function SocialMedia() {
    return (
        <div className="social-media-body">
            <div className="social-media-page">
            <h2 className="main-heading">Connect Social Media</h2>
            <div className="connect-social-button-container">
                <Button className="connect-social-button">
                    <img src="/SocialMedia/facebook.png" alt="Facebook" />
                    Facebook
                </Button>
                <Button className="connect-social-button">
                    <img src="/SocialMedia/x.svg" alt="X" />
                    X
                </Button>
                <Button className="connect-social-button">
                    <img src="/SocialMedia/instagram.png" alt="Instagram" />
                    Instagram
                </Button>
                <Button className="connect-social-button">
                    <img src="/SocialMedia/google.png" alt="Google" />
                    Google
                </Button>
            </div>
            <div className="submit-button-container">
                <Button className="submit-button" variant="primary" type="submit">
                    Continue
                </Button>
            </div> 
            </div>
        </div>
    );
}