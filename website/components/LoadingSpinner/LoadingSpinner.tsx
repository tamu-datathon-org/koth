import { Container, Row, Spinner } from "react-bootstrap";

export const LoadingSpinner = (
  <Container className="">
    <Row className="justify-content-center" style={{ marginTop: "30vh" }}>
      <Spinner animation="border" variant="secondary" />
    </Row>
  </Container>
);