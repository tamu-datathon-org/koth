import express from 'express';
import { secretKeyAuth } from "./middleware";
import Queue from "bull";
import { EvaluateSubmissionJob } from './types';

const app = express();
const port = process.env.PORT || "3000";
const secretKey = process.env.SECRET_KEY || "secretKey";
const redisUrl = process.env.REDIS_URL || "redis://127.0.0.1:6379";

const processQueue = new Queue<EvaluateSubmissionJob>("code evaluator", redisUrl);

// setup concurrency of 1 and set process file to "process.js"
processQueue.process(1, "./process.js");

app.use(express.json());

app.post("/enqueue", secretKeyAuth(secretKey), async (req, res) => {
    const {languageUsed, submissionId, downloadUrl, entrypointFile, problemId} = req.body;
    if (!languageUsed || !submissionId || !downloadUrl || !entrypointFile || !problemId) {
        return res.status(400).send();
    }
    const newSubmission: EvaluateSubmissionJob = {
        languageUsed,
        submissionId,
        downloadUrl,
        problemId,
        entrypointFile
    }
    try {
        const submittedJob = await processQueue.add(newSubmission);
        console.log(submittedJob);
        return res.status(200).send();
    } catch(e) {
        console.error(e);
        return res.status(500).send();
    }
});

app.listen(parseInt(port, 10), "0.0.0.0", () => {
    console.log(`Listening on port ${port}`)
});