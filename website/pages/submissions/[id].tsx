import { useRouter } from "next/router";
import { Navbar } from "../../components/Navbar";

const SubmissionPage = () => {
  const router = useRouter();
  const { id: submissionId } = router.query;

  return (
    <>
      <Navbar />
      <h1>{submissionId}</h1>
    </>
  );
};

export default SubmissionPage;
