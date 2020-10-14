import { EvaluateSubmissionJob } from "../types";

export interface CommandPayload {
    executable: string,
    args: string[],
    termOutput: string 
}

export interface Runner {
    canHandle: (job: EvaluateSubmissionJob) => boolean;
    getCompilationCommand: (job: EvaluateSubmissionJob) => CommandPayload | undefined;
    getRuntimeCommand: (job: EvaluateSubmissionJob) => CommandPayload;
}