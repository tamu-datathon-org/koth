import { EvaluateSubmissionJob } from "../types";
import { Evaluator } from "./evaluator";
import { StockProblemEvaluator } from "./stock-problem-evaluator";

// order to check available runners
const evaluators = [
    StockProblemEvaluator
]

/**
 * Get's the best runner that can handle the job
 * @param job Submission Job
 */
export const getBestEvaluator = (job: EvaluateSubmissionJob): Evaluator | undefined => {
    for (const evaluator of evaluators) {
        if (evaluator.canHandle(job))
            return new evaluator();
    }
} 