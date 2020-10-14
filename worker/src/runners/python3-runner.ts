import { EvaluateSubmissionJob } from "../types";
import { Runner } from "./runner";

const TD_PYTHON3_DOCKER_IMAGE_NAME = "td-challenge-python3"

export const Python3Runner: Runner = {
    canHandle: (job: EvaluateSubmissionJob) => job.languageUsed === "PYTHON3",
    getCompilationCommand: () => undefined,
    getRuntimeCommand: (job) => ({
        executable: "docker",
        termOutput: `python3 ${job.entrypointFile} < testCasesNoHeaderRow.csv`,
        args: [
            "run",
            "--network", "none",
            "-i", TD_PYTHON3_DOCKER_IMAGE_NAME,
            "-v", `${process.cwd()}/work/${job.submissionId}:/workspace`,
            "python3", `/workspace/${job.entrypointFile}`
        ]
    })
}