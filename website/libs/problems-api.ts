import * as firestore from "./firestore";

const PROBLEMS_COLLECTION = process.env.DB_PROBLEMS_COLLECTION || "problems";

export interface Problem {
    id: string;
    title: string;
    instructions: string;
    detailsLink?: string;
}

export const getProblem = async (
    problemId: string
): Promise<Problem | null> => {
    const problem = await firestore.getDoc(PROBLEMS_COLLECTION, problemId);
    if (!problem.data()) return null;
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
