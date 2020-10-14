import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { Submission } from "../../libs/submissions-api";

interface SubmissionPageData {
  submission: Submission;
}

const SubmissionPage = () => {
  const router = useRouter();
  const [data, setData] = useState<SubmissionPageData | null>(null);
  const [error, setError] = useState<boolean>(false);
  const submissionId = router.query.id as string;

  const fetchData = async () => {
    if (!submissionId) return;
    try {
      const resp = await axios.get(
        `/koth/api/submissions/${submissionId}`
      );
      setData(resp.data as SubmissionPageData);
    } catch (e) {
      setError(true);
    }
  };

  useEffect(() => {
    fetchData();
  }, [submissionId]);

  if (error) {
    return <h1>Something went wrong!</h1>;
  }
  if (!data) {
    return LoadingSpinner;
  }

  const { submission } = data;
  return (
    <>
      <h1>{submission.id}</h1>
      <p>{submission.status}</p>
      <p>{submission.creationTimestamp}</p>
    </>
  );
};

export default SubmissionPage;
