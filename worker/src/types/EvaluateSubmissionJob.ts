export type SubmissionLanguage = "PYTHON3" | "R" | "NODEJS"

export interface EvaluateSubmissionJob {
    /**
     * Problem ID this submission is for
     */
    problemId: string,
    /**
     * Firebase document id in the submissions collection where the submission lives
     */
    submissionId: string,
    /**
     * Public URL which to download submitted code archive
     */
    downloadUrl: string,
    /**
     * Language to use when compiling/running submitted code
     */
    languageUsed: SubmissionLanguage,
    /**
     * Entrypoint "main" file to execute, where root is root of the zip
     */
    entrypointFile: string
}