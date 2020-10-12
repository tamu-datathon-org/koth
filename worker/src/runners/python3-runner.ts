import { Runner } from "./Runner";

const TD_PYTHON3_DOCKER_IMAGE_NAME = "td-challenge-python3-container"

export const Python3Runner: Runner = {
    getCompilationCommand: () => undefined,
    getRuntimeCommand: (job) => ({
        executable: "docker",
        termOutput: `python3 ${job.entrypointFile} < testCasesNoHeaderRow.csv`,
        args: ["run", "--network", "none", "-i", TD_PYTHON3_DOCKER_IMAGE_NAME, "python3", job.entrypointFile]
    })
}