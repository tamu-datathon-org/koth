import { Job } from "bull";
import { EvaluateSubmissionJob } from "./types";
import unzip from "unzip";
import request from "request";

const downloadAndExtractArchive = (url: string, outputPath: string) => {
    return new Promise((resolve, reject) => {
        request(url)
            .pipe(unzip.Extract({ path: outputPath }))
            .on('error', reject)
            .on('finish', resolve);
    })
}

export default async (job: Job<EvaluateSubmissionJob>) => {
    const { data, id } = job;

    console.log(`Starting job for submissionId: ${data.submissionId}`);

    await downloadAndExtractArchive(data.downloadUrl, `work/${id}/`);
    
}