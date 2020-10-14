import { EvaluateSubmissionJob } from "../types";
import { Python3Runner } from "./python3-runner";

// order to check available runners
const runners = [
    Python3Runner
]

/**
 * Get's the best runner that can handle the job
 * @param job Submission Job
 */
export const getBestRunner = (job: EvaluateSubmissionJob) => {
    for (const runner of runners) {
        if (runner.canHandle(job))
            return runner;
    }
} 