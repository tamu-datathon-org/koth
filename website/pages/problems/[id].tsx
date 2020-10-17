import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
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
  const [error, setError] = useState<boolean>(false);
  const problemId = router.query.id as string;

  const fetchData = async () => {
    if (!problemId) return;
    try {
      console.log(problemId);
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
  const createSubmission = async (submissionId: string) => {
    try {
      await axios.post("/koth/api/submissions", {
        id: submissionId,
        problemId,
      });
      router.push(`/submissions/${submissionId}`);
    } catch (e) {
      console.log(e);
      setError(true);
    }
  };

  const submissionHandler = async (data: SubmissionModalOutput) => {
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
      await createSubmission(id);
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
  const sortedSubmissions = submissions.sort((a, b) =>
    a.score < b.score ? 1 : -1
  );

  return (
    <Container fluid className={styles.problemPage}>
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
      </Row>
      <Row className={`justify-content-center`}>
        <Col sm="auto" className={`text-center ${styles.submissionDetails}`}>
          <Row className={`pb-4 justify-content-between align-items-center`}>
            {sortedSubmissions.length ? (
              <Col sm="auto">
                Your Highest Score: {sortedSubmissions[0].score}
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
            <SubmissionsTable submissions={submissions} />
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
