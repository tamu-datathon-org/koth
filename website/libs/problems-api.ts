import * as firestore from "./firestore";

export interface Problem {
    id: string;
    title: string;
    instructions: string;
    detailsLink?: string;
}

const PROBLEMS_COLLECTION = process.env.DB_PROBLEMS_COLLECTION || "problems";

export const getProblem = async (
    problemId: string
): Promise<Problem | null> => {
    console.log(problemId);
    const problem = await firestore.getDoc(PROBLEMS_COLLECTION, problemId);
    if (!problem) return null;
    return {
        id: problemId,
        title: problem.data()?.title,
        instructions: problem.data()?.instructions,
        detailsLink: problem.data()?.detailsLink,
    };
};

export const getAllProblems = async (): Promise<Problem[]> => {
    const problems = await firestore.getCollection(PROBLEMS_COLLECTION).get();
    if (problems.empty) {
        return [];
    }
    return problems.docs.map((problem) => ({
        id: problem?.id,
        title: problem.data().title,
        instructions: problem.data().instructions,
        detailsLink: problem.data().detailsLink,
    }));
};
