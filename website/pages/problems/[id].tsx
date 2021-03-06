import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Button, Col, Container, Row, Toast } from "react-bootstrap";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import {
  SubmissionModal,
  SubmissionModalOutput,
} from "../../components/SubmissionModal";
import { SubmissionsTable } from "../../components/SubmissionsTable";
import { Problem } from "../../libs/problems-api";
import { Submission } from "../../libs/submissions-api";
import styles from "./[id].module.scss";

interface ProblemPageData {
  problem: Problem;
  submissions: Submission[];
}

const ProblemPage: React.FC<{}> = () => {
  const router = useRouter();
  const [data, setData] = useState<ProblemPageData | null>(null);
  const [showSubmissionModal, setShowSubmissionModal] = useState<boolean>(
    false
  );
  const [showToast, setShowToast] = useState(false);
  const [error, setError] = useState<boolean>(false);
  const problemId = router.query.id as string;

  const fetchData = async () => {
    if (!problemId) return;
    try {
      const problemData = await axios.get(`/koth/api/problems/${problemId}`);
      setData(problemData.data as ProblemPageData);
    } catch (e) {
      setError(true);
    }
  };

  useEffect(() => {
    fetchData();
  }, [problemId]);

  // Call this after uploading submission file.
  const createSubmission = async (
    submissionId: string,
    submissionData: SubmissionModalOutput
  ) => {
    try {
      console.log(submissionData);
      await axios.post("/koth/api/submissions", {
        id: submissionId,
        problemId,
        entrypointFile: submissionData.entrypointFile || "main.py",
      });
      router.push(`/submissions/${submissionId}`);
    } catch (e) {
      console.log(e);
      setError(true);
    }
  };

  const submissionHandler = async (data: SubmissionModalOutput) => {
    console.log(data);
    let { submissionFile } = data;
    try {
      const signedUrlResp = await axios.get("/koth/api/submission-signed-url");
      const { url, id } = signedUrlResp.data;

      // Hack to change filename for dumb AWS crap.
      var blob = submissionFile!.slice(
        0,
        submissionFile!.size,
        "application/octet-stream"
      );
      const newSubmissionFile = new File([blob], id, {
        type: "application/octet-stream",
      });

      await axios.put(url, newSubmissionFile, {
        headers: {
          "Content-Type": "application/octet-stream",
          "x-amz-acl": "public-read",
        },
      });
      await createSubmission(id, data);
    } catch (e) {
      console.log(e);
      setError(true);
    }
  };

  if (error) {
    return <h1>Something went wrong!</h1>;
  }
  if (!data) {
    return LoadingSpinner;
  }
  const { problem, submissions } = data;
  const scoreSortedSubmissions = submissions
    .slice()
    .sort((a, b) => (a.score <= b.score ? 1 : -1));
  const timeSortedSubmissions = submissions
    .slice()
    .sort((a, b) => (a.creationTimestamp >= b.creationTimestamp ? -1 : 1));

  return (
    <Container fluid className={styles.problemPage}>
      <Toast
        onClose={() => setShowToast(false)}
        style={{
          position: "absolute",
          top: "70px",
          right: "20px",
        }}
        show={showToast}
        delay={4000}
        autohide
      >
        <Toast.Header>
          <small>
            The leaderboard is disabled to make the winner a surprise!
            <br/>
            <br/>
            You can still find your best submission on the problem page.
          </small>
        </Toast.Header>
        {/* <Toast.Body>See? Just like this.</Toast.Body> */}
      </Toast>
      <Row className={`pb-3 justify-content-center`}>
        <h1 className={styles.problemTitle}>{problem.title}</h1>
      </Row>
      <Row className={`pb-3 justify-content-center`}>
        <p>{problem.instructions}</p>
      </Row>
      <Row className={`pb-5 justify-content-center`}>
        {problem.detailsLink ? (
          <p>
            <Button
              variant="outline-primary"
              href={`${problem.detailsLink}`}
              target="_blank"
              className={`${styles.btn} ${styles.detailsBtn}`}
            >
              Details
            </Button>
          </p>
        ) : (
          <></>
        )}
        <p>
          <Button
            variant="outline-primary"
            // href={`/koth/leaderboard/${problemId}`}
            onClick={() => setShowToast(true)}
            target="_blank"
            className={`${styles.btn} ${styles.disabledLeaderboardbtn}`}
          >
            Leaderboard
          </Button>
        </p>
      </Row>
      <Row className={`justify-content-center`}>
        <Col sm="auto" className={`text-center ${styles.submissionDetails}`}>
          <Row className={`pb-4 justify-content-between align-items-center`}>
            {scoreSortedSubmissions.length ? (
              <Col sm="auto">
                Your Highest Score:{" "}
                {Number(scoreSortedSubmissions[0].score).toFixed(2)}
              </Col>
            ) : (
              <></>
            )}
            <Col sm="auto">
              <Button
                variant="outline-primary"
                className={`${styles.btn}`}
                onClick={() => setShowSubmissionModal(true)}
              >
                Add New Submission
              </Button>
            </Col>
          </Row>
          <Row className={`justify-content-between align-items-center`}>
            <SubmissionsTable
              submissions={timeSortedSubmissions}
              showStatus={true}
              showSubmissionLinks={true}
            />
          </Row>
        </Col>
      </Row>
      <SubmissionModal
        show={showSubmissionModal}
        onHide={() => setShowSubmissionModal(false)}
        onSubmit={submissionHandler}
      />
    </Container>
  );
};

export default ProblemPage;
