 import { Container, Col, Row } from "react-bootstrap";


 //for when we make a nav bar or some sort of nav componenet

export default function Navigation() {
  <Row>
    <Col className="text-center">
      <h1>Login System</h1>

      <nav id="navigationFromHome">
        <a href="/login">Login</a>
        <a href="/free">Free Component</a>
        <a href="/auth">Auth Component</a>
        <a href="/register">Registration</a>
      </nav>
    </Col>
  </Row>;
}

