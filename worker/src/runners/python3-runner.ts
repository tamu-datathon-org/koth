import { EvaluateSubmissionJob } from "../types";
import { Runner } from "./runner";

const TD_PYTHON3_DOCKER_IMAGE_NAME = "td-challenge-python3"

export const Python3Runner: Runner = {
    canHandle: (job: EvaluateSubmissionJob) => job.languageUsed === "PYTHON3",
    getCompilationCommand: (job) => ({
        executable: "docker",
        termOutput: `Here are the files in the folder (hopfully ${job.entrypointFile} is there because we sure are not checking. But you should check!):`,
        args: [
            "run",
            "--network", "none",
            "-v", `${process.env.HOST_KOTH_WORKER_ROOT}/work/${job.submissionId}:/workspace`,
            "-i", TD_PYTHON3_DOCKER_IMAGE_NAME,
            "tree", `/workspace`,
        ]
    }),
    getRuntimeCommand: (job) => ({
        executable: "docker",
        termOutput: `python3 -u ${job.entrypointFile} < testCasesNoHeaderRow.csv`,
        args: [
            "run",
            "--network", "none",
            "-v", `${process.env.HOST_KOTH_WORKER_ROOT}/work/${job.submissionId}:/workspace`,
            "-i", TD_PYTHON3_DOCKER_IMAGE_NAME,
            "python3", '-u', `/workspace/${job.entrypointFile}`,
        ]
    })
}