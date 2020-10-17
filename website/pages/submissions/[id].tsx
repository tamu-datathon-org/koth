import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Terminal } from "xterm";
import { Button, Col, Container, Row, Toast } from "react-bootstrap";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { statusStyleMap } from "../../components/SubmissionsTable";
import { Submission } from "../../libs/submissions-api";
import styles from "./[id].module.scss";

const TEST_OUTPUT = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 

Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 

uis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
`;

interface SubmissionPageData {
  submission: Submission;
}

const SubmissionPage = () => {
  const router = useRouter();
  const [data, setData] = useState<SubmissionPageData | null>(null);
  const [error, setError] = useState<boolean>(false);
  const [terminal, setTerminal] = useState<Terminal | null>(null);
  const [showToast, setShowToast] = useState(false);
  const submissionId = router.query.id as string;

  const fetchData = async () => {
    if (!submissionId) return;
    try {
      const resp = await axios.get(`/koth/api/submissions/${submissionId}`);
      const data = resp.data as SubmissionPageData;

      // const terminalOutput = data.submission.data?.output || TEST_OUTPUT;
      // terminal?.reset();
      // terminal?.write(terminalOutput);

      setData(data);
    } catch (e) {
      setError(true);
    }
  };
  useEffect(() => {
    fetchData();
  }, [submissionId]);

  // Initialize terminal.
  // useEffect(() => {
  //   const terminal = new Terminal();
  //   terminal.open(document.getElementById("terminalOutput")!);
  //   setTerminal(terminal);
  // }, []);

  if (error) {
    return <h1>Something went wrong!</h1>;
  }
  if (!data) {
    return LoadingSpinner;
  }

  const { submission } = data;
  return (
    <Container fluid className={styles.submissionsPage}>
      {/* Toast for copying submission link */}
      <Toast
        onClose={() => setShowToast(false)}
        style={{
          position: "absolute",
          top: "70px",
          right: "20px",
        }}
        show={showToast}
        delay={2000}
        autohide
      >
        <Toast.Header>
          <small>Copied submission link to clipboard!</small>
        </Toast.Header>
        {/* <Toast.Body>See? Just like this.</Toast.Body> */}
      </Toast>
      <Row className="justify-content-center ">
        <Col sm="auto" className={styles.submissionContainer}>
          <Row className="mb-4 justify-content-between align-items-center">
            <Button
              variant="outline-primary"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setShowToast(true);
              }}
            >
              Copy Submission Link
            </Button>
            <h5>
              Status:{" "}
              <span className={statusStyleMap(submission.status)}>
                {submission.status}
              </span>
            </h5>
          </Row>
          <Row className={`mb-3`}>
            <h1>Your Submission</h1>
          </Row>
          <Row className={`mb-3 justify-content-between`}>
            <h5>Problem: {submission.problemId}</h5>
            <h5>Score: {submission.score}</h5>
          </Row>
          <Row>
            <h5>Output:</h5>
          </Row>
          <Row>
            <pre className={`${styles.outputDiv}`} id="terminalOutput">
              {submission.termOutput|| TEST_OUTPUT}
            </pre>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default SubmissionPage;
