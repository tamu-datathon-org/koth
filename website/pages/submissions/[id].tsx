import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
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
      const resp = await axios.get(`/koth/api/submissions/${submissionId}`);
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

  const handleFileSubmit = async (file: File) => {
    try {
      const urlResponse = await axios.get("/koth/api/submission-signed-url");
      const signedUrl = urlResponse.data.url[0];
      console.log(signedUrl);
      var formData = new FormData();
      formData.append("file", file);
      axios.post(signedUrl, formData, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "multipart/form-data",
        },
      });
    } catch (e) {}
  };

  const handleSubmissionBtnClick = () => {
    // Hack to get a file dialog box.
    const input = document.createElement("input");
    input.type = "file";

    input.onchange = (e: any) => {
      handleFileSubmit(e.target.files[0]);
    };
    input.click();
  };

  const { submission } = data;
  return (
    <>
      <h1>{submission.id}</h1>
      <p>{submission.status}</p>
      <p>{submission.creationTimestamp}</p>
      <Button onClick={handleSubmissionBtnClick}>Select a file</Button>
    </>
  );
};

export default SubmissionPage;
