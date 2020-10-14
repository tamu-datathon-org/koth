import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Container, Row, Spinner } from "react-bootstrap";
import { Problem } from "../../libs/problems-api";
import { Submission } from "../../libs/submissions-api";

interface ProblemPageData {
  problem: Problem;
  submissions: Submission[];
}

const LoadingSpinner = (
  <Container className="">
    <Row className="justify-content-center" style={{ marginTop: "30vh" }}>
      <Spinner animation="border" variant="secondary" />
    </Row>
  </Container>
);

const ProblemPage: React.FC<{}> = () => {
  const router = useRouter();
  const [data, setData] = useState<ProblemPageData | null>(null);
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

  if (error) {
    return <h1>Something went wrong!</h1>;
  }
  if (!data) {
    return LoadingSpinner;
  }
  const { problem, submissions } = data;
  return (
    <>
      <h1>{problem.id}</h1>
      <p>{problem.instructions}</p>
    </>
  );
};

export default ProblemPage;
