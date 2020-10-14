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
            "-v", `${process.env.HOST_KOTH_WORKER_ROOT}/work/${job.submissionId}:/workspace`,
            "-it", TD_PYTHON3_DOCKER_IMAGE_NAME,
            "python3", `/workspace/${job.entrypointFile}`,
            "<<EOF"
        ]
    })
}