import { NowRequest, NowResponse } from "@vercel/node";
import { authenticatedRoute } from "../../../libs/middleware";
import { v4 as uuid } from "uuid";
import { getSignedUrlForSubmissionFile } from "../../../libs/submissions-api";

const getSubmissionSignedUrlHandler = async (
  _req: NowRequest,
  res: NowResponse
): Promise<void> => {
  try {
    const fileName = uuid();
    const url = await getSignedUrlForSubmissionFile(fileName);
    res.status(200).json({ url });
  } catch (e) {
    console.log(e);
    res.status(500).send("Something went wrong");
  }
};

export default authenticatedRoute(getSubmissionSignedUrlHandler);
