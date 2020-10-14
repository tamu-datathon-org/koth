import express from 'express';
import { secretKeyAuth } from "./middleware";
import Queue from "bull";
import { UI, setQueues } from "bull-board";
import { EvaluateSubmissionJob } from './types';
import { adminAuth } from './middleware/admin-auth';
import cookieParser from "cookie-parser";

const app = express();
const port = process.env.PORT || "3000";
const secretKey = process.env.SECRET_KEY || "secretKey";
const redisUrl = process.env.REDIS_URL || "redis://127.0.0.1:6379";
const gatekeeperUrl = process.env.GATEKEEPER_URL || "https://tamudatathon.com/auth"; 

const processQueue = new Queue<EvaluateSubmissionJob>("code evaluator", redisUrl);

setQueues(processQueue);

// setup concurrency of 1 and set process file to "process.js"
processQueue.process(1, process.cwd() + "/dist/process.js");

app.use(express.json());

app.use(cookieParser())
app.use('/koth/admin/queues', adminAuth(gatekeeperUrl), UI);

app.post("/koth/admin/enqueue", secretKeyAuth(secretKey), async (req, res) => {
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