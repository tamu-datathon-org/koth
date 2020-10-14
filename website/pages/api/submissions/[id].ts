import { NowRequest, NowResponse } from "@vercel/node";
import { authenticatedRoute } from "../../../libs/middleware";
import { getSubmission } from "../../../libs/submissions-api";

const getSubmissionDataHandler = async (
  req: NowRequest,
  res: NowResponse
): Promise<void> => {
  const submissionId = req.query.id as string;

  const submission = await getSubmission(submissionId);
  if (!submission) {
    res
      .status(404)
      .json({ err: "Submission with the given ID could not be found" });
    return;
  }

  res.status(200).json({ submission });
  return;
};

export default authenticatedRoute(getSubmissionDataHandler);
