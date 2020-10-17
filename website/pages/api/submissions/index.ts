import { NowRequest, NowResponse } from "@vercel/node";
import Axios from "axios";
import { User } from "../../../components/UserProvider";
import { authenticatedRoute } from "../../../libs/middleware";
import { createSubmission, getSubmission } from "../../../libs/submissions-api";

const getSubmissionDataHandler = async (
  req: NowRequest,
  res: NowResponse,
  user: User
): Promise<void> => {
  try {
    if (req.method !== "POST") return;

    if (
      !req.body ||
      !req.body.id ||
      !req.body.problemId ||
      !req.body.downloadUrl
    ) {
      res.status(400).json({
        err:
          "The request body must contain id (submission ID), problemId and downloadUrl",
      });
      return;
    }

    const { id: submissionId, problemId, downloadUrl } = req.body;

    const submissionExistsCheck = await getSubmission(submissionId);
    if (submissionExistsCheck) {
      res.status(409).json({ err: "The submission already exists" });
      return;
    }
    const submission = await createSubmission(
      submissionId,
      problemId,
      user.authId
    );

    await Axios.post(
      "/koth/admin/enqueue",
      {
        languageUsed: "PYTHON#",
        entrypointFile: "main.py",
        problemId,
        submissionId,
        downloadUrl,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: process.env.GATEKEEPER_INTEGRATION_SECRET,
        },
      }
    );

    res.status(201).json({ submission });
    return;
  } catch (e) {
    console.log(e);
    res.status(500).json({ err: "Something went wrong." });
    return;
  }
};

export default authenticatedRoute(getSubmissionDataHandler);
