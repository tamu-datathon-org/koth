import { NowRequest, NowResponse } from "@vercel/node";
import { User } from "../../../components/UserProvider";
import { authenticatedRoute } from "../../../libs/middleware";
import { createSubmission, getSubmission } from "../../../libs/submissions-api";

const getSubmissionDataHandler = async (
  req: NowRequest,
  res: NowResponse,
  user: User
): Promise<void> => {
  if (req.method !== "POST") return;

  if (!req.body || !req.body.id || !req.body.problemId) {
    res
      .status(400)
      .json({
        err: "The request body must contain id (submission ID) and problemId",
      });
    return;
  }

  const submissionId = req.body.id;
  const submissionExistsCheck = await getSubmission(submissionId);
  if (submissionExistsCheck) {
    res.status(409).json({ err: "The submission already exists" });
    return;
  }

  const submission = await createSubmission(
    submissionId,
    req.body.problemId,
    user.authId
  );
  res.status(201).json({ submission });
  return;
};

export default authenticatedRoute(getSubmissionDataHandler);
