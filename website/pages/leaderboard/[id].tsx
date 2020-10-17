import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { SubmissionsTable } from "../../components/SubmissionsTable";
import { useActiveUser } from "../../components/UserProvider";
import { Problem } from "../../libs/problems-api";
import { Submission } from "../../libs/submissions-api";
import styles from "./[id].module.scss";

interface ProblemPageData {
  problem: Problem;
  submissions: Submission[];
}

const ProblemPage: React.FC<{}> = () => {
  const router = useRouter();
  const { user } = useActiveUser();
  const [data, setData] = useState<ProblemPageData | null>(null);
  const [error, setError] = useState<boolean>(false);
  const problemId = router.query.id as string;

  const fetchData = async () => {
    if (!problemId) return;
    try {
      const problemData = await axios.get(`/koth/api/leaderboard/${problemId}`);
      setData(problemData.data as ProblemPageData);
    } catch (e) {
      setError(true);
    }
  };

  useEffect(() => {
    fetchData();
  }, [problemId]);

  if (error) {
    return <h1>Something went wrong!</h1>;
  }
  if (!data) {
    return LoadingSpinner;
  }
  const { problem, submissions } = data;
  const scoreSortedSubmissions = submissions.sort((a, b) =>
    a.score < b.score ? 1 : -1
  );

  const scoreSortedUserSubmissions = scoreSortedSubmissions.filter(
    (submission) => submission.userAuthId === user?.authId
  );

  return (
    <Container fluid className={styles.problemPage}>
      <Row className={`pb-3 justify-content-center`}>
        <h2 className={styles.problemTitle}>{problem.title} - Leaderboard</h2>
      </Row>
      <Row className={`justify-content-center`}>
        <Col sm="auto" className={`text-center ${styles.submissionDetails}`}>
          <Row className={`pb-4 justify-content-center align-items-center`}>
            {scoreSortedUserSubmissions.length ? (
              <Col sm="auto">
                Your Highest Score: {scoreSortedUserSubmissions[0].score}
              </Col>
            ) : (
              <></>
            )}
          </Row>
          <Row className={`justify-content-between align-items-center`}>
            <SubmissionsTable
              submissions={scoreSortedSubmissions}
              showStatus={false}
            />
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default ProblemPage;
