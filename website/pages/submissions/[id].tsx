import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Button, Col, Container, Row, Toast } from "react-bootstrap";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { statusStyleMap } from "../../components/SubmissionsTable";
import { Submission } from "../../libs/submissions-api";
import styles from "./[id].module.scss";
import dayjs from "dayjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const DEFAULT_TERMINAL_OUTPUT = `No terminal output.`;

interface SubmissionPageData {
  submission: Submission;
}

const SubmissionPage = () => {
  const router = useRouter();
  const [error, setError] = useState<boolean>(false);
  const [showToast, setShowToast] = useState(false);
  const submissionId = router.query.id as string;
  
  const submission = useDocument<Submission>(`/submissions/${submissionId}`);

  if (error) {
    return <h1>Something went wrong!</h1>;
  }
  if (!submission) {
    return LoadingSpinner;
  }

  console.log(submission);
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
          <Row className="mb-3">
            <a href={`/koth/problems/${submission.problemId}`}>
              <FontAwesomeIcon
                icon={faArrowLeft}
                style={{fontSize: 25}}
              />
            </a>
          </Row>
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
            <h6>{dayjs(submission.creationTimestamp).fromNow()}</h6>
          </Row>
          <Row className={`mb-3 justify-content-between align-items-center`}>
            <h2>Your Submission</h2>
            <h5>
              Status:{" "}
              <span className={statusStyleMap(submission.status)}>
                {submission.status}
              </span>
            </h5>
          </Row>
          <Row className={`mb-3 justify-content-between align-items-center`}>
            <h5>Problem: {submission.problemId}</h5>
            <h5>Score: {submission.score}</h5>
          </Row>
          <Row className={`mb-3 align-items-center`}>
            <h5>Output:</h5>
          </Row>
          <Row>
            <div className={styles.terminalDiv}>
              <div className={styles.terminalHeader}>
                <div
                  className={`${styles.terminalDot} ${styles.terminalRedDot}`}
                ></div>
                <div
                  className={`${styles.terminalDot} ${styles.terminalYellowDot}`}
                ></div>
                <div
                  className={`${styles.terminalDot} ${styles.terminalGreenDot}`}
                ></div>
              </div>
              <div>
                <pre
                  className={`${styles.terminalTextDiv}`}
                  id="terminalOutput"
                >
                  {submission.termOutput || DEFAULT_TERMINAL_OUTPUT}
                </pre>
              </div>
            </div>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default SubmissionPage;
