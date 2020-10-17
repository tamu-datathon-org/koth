import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { SubmissionsTable } from "../../components/SubmissionsTable";
import { useActiveUser } from "../../components/UserProvider";
import { Problem } from "../../libs/problems-api";
import { Submission } from "../../libs/submissions-api";
import styles from "./[id].module.scss";

interface LeaderboardPageData {
  problem: Problem;
  submissions: Submission[];
}

const LeaderboardPage: React.FC<{}> = () => {
  const router = useRouter();
  const { user } = useActiveUser();
  const [data, setData] = useState<LeaderboardPageData | null>(null);
  const [error, setError] = useState<boolean>(false);
  const problemId = router.query.id as string;

  const fetchData = async () => {
    if (!problemId) return;
    try {
      const problemData = await axios.get(`/koth/api/leaderboard/${problemId}`);
      setData(problemData.data as LeaderboardPageData);
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
  // Submissions from leaderboard endpoint are pre-sorted.
  const scoreSortedUserSubmissions = submissions
    .slice()
    .filter((submission) => submission.userAuthId === user?.authId);

  const failFilteredSubmissions = submissions
    .slice()
    .filter((val) => val.score > 0);

  const topUserRank = scoreSortedUserSubmissions.length
    ? submissions
        .map((val) => val.id)
        .indexOf(scoreSortedUserSubmissions[0].id) + 1
    : null;

  return (
    <Container fluid className={styles.problemPage}>
      <Row className={`pb-3 justify-content-center`}>
        <h2 className={styles.problemTitle}>{problem.title} - Leaderboard</h2>
      </Row>
      <Row className={`justify-content-center`}>
        <Col sm="auto" className={`text-center ${styles.submissionDetails}`}>
          <Row className={`pb-4 justify-content-between align-items-center`}>
            {scoreSortedUserSubmissions.length ? (
              <>
                <h5>
                  Your Highest Score: {scoreSortedUserSubmissions[0].score}{" "}
                </h5>
                <h5>Rank #{topUserRank}</h5>
              </>
            ) : (
              <></>
            )}
          </Row>
          <Row className={`pb-5 justify-content-center`}>
            <Button
              variant="outline-primary"
              href={`/koth/problems/${problem.id}`}
              target="_blank"
              className={`${styles.btn} ${styles.detailsBtn}`}
            >
              Problem Page
            </Button>
          </Row>
          <Row className={`justify-content-between align-items-center`}>
            <SubmissionsTable
              submissions={failFilteredSubmissions}
              showStatus={false}
            />
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default LeaderboardPage;
