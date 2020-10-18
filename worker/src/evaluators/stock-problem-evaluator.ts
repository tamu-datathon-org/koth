import { EvaluateSubmissionJob } from "../types";
import { Evaluator } from "./evaluator";
import fs from 'fs';

const STOCK_PROBLEM_ID = "stock-prediction";

/**
 * Evaluator for the Stock challenge
 * Adapted from the evaluator made by Seth Hamilton (in python)
 */
export class StockProblemEvaluator extends Evaluator {

    private cash: number;
    private numberOfShares: number;
    private currentRow: number = 0;

    private numBuys: number = 0;
    private numSells: number = 0;
    private numHolds: number = 0;

    private testData: string[][] = [];

    constructor() {
        super();

        this.cash = 1000;
        this.numberOfShares = 0;

        // not ideal but whatever
        const data = fs.readFileSync(process.env.STOCK_PROBLEM_TEST_FILE || "test_data/stonks.csv", 'utf-8').trim();
        const lines = data.split(/\r?\n/);

        lines.forEach((line, index) => {
            if (index <= 0) return; // skip the first line as its the header row
            // add each line into the data string matrix
            this.testData.push(line.split(",").map(val => val.trim()))
        })
    }

    /**
     * Function to determine whether this particular evaluator should be used with submission
     */
    public static canHandle(job: EvaluateSubmissionJob): boolean {
        return job.problemId === STOCK_PROBLEM_ID;
    }
    

    public onProgramOutput(job: EvaluateSubmissionJob, output: string, writeToInput: (textToWrite: string) => void) {
        output=output.trim();
                
        if (this.currentRow < this.testData.length) {
            writeToInput(this.testData[this.currentRow].join(", ") + "\n");
            this.currentRow += 1;
        }

        // first request, no actual output from code. just need to send the first test case
        if (output === "")
            return true;

        const splitOutput = output.split(" ");
        if (splitOutput.length <= 0 || splitOutput.length > 2) {
            console.log("Retrying row, got weird response: " + JSON.stringify(splitOutput));
            this.currentRow -= 1;
            return true;
        }

        const action = splitOutput[0].trim();
        let frac: number | undefined = undefined;
        if (splitOutput.length === 2) {
            frac = parseFloat(splitOutput[1]);
        }

        // the output from the program is a reaction to the last writeToInput
        const lastRowIndex = this.currentRow - 1;
        const rowOpen = parseFloat(this.testData[lastRowIndex][0]);

        if (action === "BUY") {
            if (!frac)
                throw new Error("Did not output a frac along side the BUY action: " + JSON.stringify(splitOutput));
            if (frac < 0 || frac > 1) {
                throw new Error("Illegal Fraction Value (needs to be between 0 and 1 inclusive). The SEC is not happy.");
            }
            this.numberOfShares += frac * this.cash / rowOpen;
            this.cash -= frac * this.cash;
            this.numBuys += 1;
        } else if (action === "SELL") {
            if (!frac)
                throw new Error("Did not output a frac along side the SELL action: " + JSON.stringify(splitOutput));
            if (frac < 0 || frac > 1) {
                throw new Error("Illegal Fraction Value (needs to be between 0 and 1 inclusive). The SEC is not happy.");
            }
            this.cash += frac * this.numberOfShares * rowOpen;
            this.numberOfShares -= frac * this.numberOfShares;
            this.numSells += 1
        } else if (action === "HOLD") {
            this.numHolds += 1;
        } else {
            // throw new Error("Program Outputted Invalid Action: " + JSON.stringify(splitOutput));
            console.log("Retrying row, got weird response: " + JSON.stringify(splitOutput));
            this.currentRow -= 1;
        }
        
        if (this.currentRow >= this.testData.length - 1)
            return false;
        return true;
    }

    public getScore() {
        const lastCloseVal = parseFloat(this.testData[this.testData.length - 1][3]);
        return this.cash + this.numberOfShares * lastCloseVal;
    }

    public generateReport(): string {
        return `=======ENDING REPORT=======
- ending cash:\t${this.getScore()},
- # of buys:\t${this.numBuys},
- # of sells:\t${this.numSells}
- # of holds:\t${this.numHolds}
        `;
    }

    public reset(): void {
        this.cash = 0;
        this.numberOfShares = 0;
        this.currentRow = 0;

        this.numBuys = 0;
        this.numSells = 0;
        this.numHolds = 0;
    }
}