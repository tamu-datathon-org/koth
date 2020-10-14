import { getCollection, getDoc } from "./firestore";

const SUBMISSIONS_COLLECTION =
    process.env.DB_SUBMISSIONS_COLLECTION || "submissions";

export interface Submission {
    id: string;
    userAuthId: string;
    problemId: string;
    status: string;
    score?: number;
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
  }
};
