import { useRouter } from "next/router";

const SubmissionPage = () => {
  const router = useRouter();
  const { id: submissionId } = router.query;

  return (
    <>
      <h1>{submissionId}</h1>
    </>
  );
};

export default SubmissionPage;
