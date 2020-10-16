import { getCollection, getDoc, setDoc } from "./firestore";
import { firebaseBucket } from "./firebase";

const SUBMISSIONS_COLLECTION =
    process.env.DB_SUBMISSIONS_COLLECTION || "submissions";

export interface Submission {
    id: string;
    userAuthId: string;
    problemId: string;
    status: string;
    score: number;
    creationTimestamp: number;
    data?: any;
}

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
    return submissions.docs.map((submission) => ({
        id: submission.id,
        userAuthId: submission.data().userAuthId,
        problemId: submission.data().problemId,
        status: submission.data().status,
        score: submission.data().score,
        data: submission.data().data,
        creationTimestamp: submission.data().creationTimestamp,
    }));
};

export const getSubmission = async (
    submissionId: string
): Promise<Submission | null> => {
    let submission = await getDoc(SUBMISSIONS_COLLECTION, submissionId);
    if (!submission.data()) return null;
    return {
      id: submissionId,
      userAuthId: submission.data()?.userAuthId,
      problemId: submission.data()?.problemId,
      status: submission.data()?.status,
      score: submission.data()?.score,
      data: submission.data()?.data,
      creationTimestamp: submission.data()?.creationTimestamp,
  }
};

export const createSubmission = async (id: string, problemId: string, userAuthId: string): Promise<Submission> => {
    const submission: Submission = {
        id,
        problemId,
        userAuthId,
        status: "SUBMITTED",
        score: 0,
        creationTimestamp: Date.now()
    };
    await setDoc(SUBMISSIONS_COLLECTION, id, submission);
    return submission;
}

export const getSignedUrlForSubmissionFile = (fileName: string) =>
  firebaseBucket.file(`${SUBMISSIONS_COLLECTION}/${fileName}`).getSignedUrl({
    action: "write",
    expires: Date.now() + 1000 * 60 * 5, // Signed URL expires in 5 minutes
  });