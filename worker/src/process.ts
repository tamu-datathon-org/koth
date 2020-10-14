import { Job } from "bull";
import { execFile, spawn } from "child_process";
import request from "request";
import fs from "fs";
import unzipper from "unzipper";
import { Evaluator } from "./evaluators";
import { getBestEvaluator } from "./evaluators/get-best-evaluator";
import { CommandPayload } from "./runners";
import { getBestRunner } from "./runners/get-best-runner";
import { EvaluateSubmissionJob } from "./types";

const downloadAndExtractArchive = (url: string, outputPath: string) => {
    return new Promise((resolve, reject) => {
        request(url)
            .pipe(unzipper.Extract({ path: outputPath }))
            .on('error', reject)
            .on('finish', resolve);
    })
}

const compileSubmission = async (compilationCommand: CommandPayload | undefined) => {
    let termOutput = "";

    if (!compilationCommand)
        return termOutput;

    return new Promise((resolve, reject) => {
        execFile(compilationCommand.executable, compilationCommand.args, {
            timeout: 10000
        }, (error, stdout, stderr) => {
            if (error) return reject(error);

            termOutput += stdout;
            termOutput += stderr;

            resolve(termOutput + "\n");
        });
    })
}

const evaluateSubmission = async (runtimeCommand: CommandPayload | undefined, job: EvaluateSubmissionJob, evaluator: Evaluator) => {
    let termOutput = "";
    
    if (!runtimeCommand)
    return termOutput;
    
    return new Promise((resolve, reject) => {
        const childProcess = spawn(runtimeCommand.executable, runtimeCommand.args, {
            timeout: 10000
        });

        const onProcessOutputs = (chunk: string) => {
            let evalError: Error | undefined = undefined;
            let shouldStayAlive = false;
            try {
                shouldStayAlive = evaluator.onProgramOutput(
                    job,
                    chunk.toString(),
                    (textToWrite) => childProcess.stdin?.write(textToWrite)
                );
            } catch (e) {
                evalError = e;
                shouldStayAlive = false;
            } finally {
                if (!shouldStayAlive) {
                    childProcess.stdin?.end();
                    childProcess.kill("SIGABRT");
                    if (evalError) return reject(evalError);
                }
            }
        }

        let stdoutBuffer = "";
        childProcess.stdout?.on('data', (chunk) => {
            const chunkStr = chunk.toString();
            for (let i=0; i<chunkStr.length; i++) {
                stdoutBuffer += chunkStr[i];
                if (chunkStr[i] === '\n') {
                    onProcessOutputs(stdoutBuffer);
                    stdoutBuffer = "";
                }
            }
        });

        // do this to force evaluator to start outputting to stdin
        onProcessOutputs("");

        childProcess.on('error', (error) => {
            console.log("exec error")
            return reject(error);
        });

        childProcess.on('exit', (code) => {
            console.log("on exit", code)
            if (code == 143) {
                console.log("timeout");
                return reject(new Error("Your program exceeded the runtime limit (10sec)..."));
            } else if (code != 0) {
                console.log("on runtime error");
                return reject(new Error("A runtime error occurred."));
            } else {
                console.log("on success");
                termOutput += "--hidden output--\n";
                return resolve(termOutput);
            }
        });
    });
}

module.exports = async (job: Job<EvaluateSubmissionJob>) => {
    const { data } = job;
    let finalTermOutput = "";
    let finalScore = -1;

    job.log(`Starting job for submissionId: ${data.submissionId}`);

    const runner = getBestRunner(data);
    const evaluator = getBestEvaluator(data);

    try {
        if (!runner)
            throw new Error("Couldn't find a valid runner to handle job (is the languageUsed valid?)");

        if (!evaluator)
            throw new Error("Couldn't find a valid evaluator for this job...");

        finalTermOutput += "Downloading and extracting code archive...\n"
        await downloadAndExtractArchive(data.downloadUrl, `work/${data.submissionId}/`);
        await job.progress(33);

        finalTermOutput += "Compiling Submission (if applicable)...\n";
        const compilationCommand = runner.getCompilationCommand(data);
        if (compilationCommand)
            finalTermOutput += `$ ${compilationCommand.termOutput}\n`;
        finalTermOutput += await compileSubmission(compilationCommand);
        await job.progress(66);

        finalTermOutput += "Executing submission on test data...\n";
        const runtimeCommand = runner.getRuntimeCommand(data);
        if (runtimeCommand)
            finalTermOutput += `$ ${runtimeCommand.termOutput}\n`;

        console.log(runtimeCommand.executable, runtimeCommand.args.join(" "))

        finalTermOutput += await evaluateSubmission(runtimeCommand, data, evaluator);
        await job.progress(99);

        finalTermOutput += "\n";
        finalTermOutput += evaluator.generateReport();
        finalScore = evaluator.getScore();
        await job.log(finalTermOutput);
    } catch (e) {
        job.log(finalTermOutput);
        finalTermOutput += `\033[31m${e.message}\033[39m`;
        await job.log(e.stack);
    }

    await fs.promises.rmdir(`work/${data.submissionId}/`);

    await job.progress(100);

    return {
        status: finalScore < 0 ? "ERRORED" : "SUCCESS",
        finalScore,
        termOutput: finalTermOutput
    }
}