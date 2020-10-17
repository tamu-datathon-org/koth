import { getCollection, getDoc, setDoc } from "./firestore";
import { S3 } from "aws-sdk";

const s3 = new S3({
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.KOTH_AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.KOTH_AWS_SECRET_ACCESS_KEY!,
  },
});

const SUBMISSIONS_COLLECTION =
  process.env.DB_SUBMISSIONS_COLLECTION || "submissions";

export type SubmissionStatus =
  | "SUBMITTED"
  | "IN_PROGRESS"
  | "SUCCESS"
  | "FAILED";

export interface Submission {
  id: string;
  userAuthId: string;
  problemId: string;
  status: SubmissionStatus;
  score: number;
  creationTimestamp: number;
  data?: any;
  termOutput?: string;
}

const createSubmissionObject = (data: any) => ({
  id: data.data()?.id,
  userAuthId: data.data()?.userAuthId,
  problemId: data.data()?.problemId,
  status: data.data()?.status,
  score: data.data()?.score,
  data: data.data()?.data,
  creationTimestamp: data.data()?.creationTimestamp,
  termOutput: data.data()?.termOutput,
});

// TODO: Scrub userAuthIds from submissions.
export const getSubmissionsForProblem = async (problemId: string): Submission[] =>
  (
    await getCollection(SUBMISSIONS_COLLECTION)
      .where("problemId", "==", problemId)
      .get()
  ).docs.map(createSubmissionObject);

export const getUserSubmissions = async (
  userAuthId: string,
  problemId: string,
  filterNonFinished = false
): Promise<Submission[]> => {
  let query = getCollection(SUBMISSIONS_COLLECTION)
    .where("userAuthId", "==", userAuthId)
    .where("problemId", "==", problemId);
  if (filterNonFinished) {
    query = query.where("status", "in", ["SUCCESS", "ERROR"]);
  }
  const submissions = await query.get();
  return submissions.docs.map(createSubmissionObject);
};

export const getSubmission = async (
  submissionId: string
): Promise<Submission | null> => {
  let submission = await getDoc(SUBMISSIONS_COLLECTION, submissionId);
  if (!submission.data()) return null;
  return createSubmissionObject(submission);
};

export const createSubmission = async (
  id: string,
  problemId: string,
  userAuthId: string
): Promise<Submission> => {
  const submission: Submission = {
    id,
    problemId,
    userAuthId,
    status: "SUBMITTED",
    score: 0,
    creationTimestamp: Date.now(),
  };
  await setDoc(SUBMISSIONS_COLLECTION, id, submission);
  return submission;
};

export const getSignedUrlForSubmissionFile = (
  fileName: string,
  type: "getObject" | "putObject" = "getObject"
) =>
  s3.getSignedUrlPromise(type, {
    Bucket: "koth-submissions",
    Key: fileName,
    Expires: 600,
    ...(type === "getObject"
      ? {}
      : { ContentType: "application/octet-stream", ACL: "public-read" }),
  });
