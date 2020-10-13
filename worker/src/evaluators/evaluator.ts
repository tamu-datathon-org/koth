import { EvaluateSubmissionJob } from "../types";

/**
 * Class interface for a problem's "evaluator"
 */
export abstract class Evaluator {
    /**
     * Function to determine whether this particular evaluator should be used with submission
     */
    public abstract canHandle(job: EvaluateSubmissionJob): boolean;
    /**
     * Function that is called everytime the submission prints to stdout, each time the evaluator has a change to write another line to stdin
     * @returns true if the program should continue to be executed, false if program should be terminated (usually done when test case is over)
     */
    public abstract onProgramOutput(job: EvaluateSubmissionJob, output: string, writeToInput: (textToWrite: string) => void): boolean;
    /**
     * Function that returns the final score the current submisison should recieve. Called when 
     */
    public abstract getScore(): number;
    /**
     * Function to reset states so class can be reused for the next submission
     */
    public abstract reset(): void;
    /**
     * Function to generate report that will be appended to submission logs
     */
    public abstract generateReport(): string;
}