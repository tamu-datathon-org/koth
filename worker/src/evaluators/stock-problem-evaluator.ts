import { EvaluateSubmissionJob } from "../types";
import { Evaluator } from "./evaluator";
import fs from 'fs';

const STOCK_PROBLEM_ID = "dfsfsdfmksldafm";

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
        const data = fs.readFileSync(process.env.STOCK_PROBLEM_TEST_FILE || "test_data/stonks.csv", 'utf-8');
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
        if (this.currentRow < this.testData.length) {
            writeToInput(this.testData[this.currentRow].join(", ") + "\n");
            this.currentRow += 1;
        }

        const splitOutput = output.split(" ");
        if (splitOutput.length != 2) {
            return true;
        }

        const [action, frac] = [splitOutput[0], parseFloat(splitOutput[1])];

        // the output from the program is a reaction to the last writeToInput
        const lastRowIndex = this.currentRow - 1;
        const rowOpen = parseFloat(this.testData[lastRowIndex][1]);

        if (action === "BUY") {
            this.numberOfShares += frac * this.cash / rowOpen;
            this.cash -= frac * this.cash;
            this.numBuys += 1;
        } else if (action === "SELL") {
            this.cash += Math.floor(frac * this.numberOfShares) * rowOpen;
        } else if (action === "HOLD") {
            this.numHolds += 1;
        } else {
            throw new Error("Program Outputted Invalid Action: " + JSON.stringify(splitOutput));
        }
        
        if (this.currentRow >= this.testData.length)
            return false;
        return true;
    }

    public getScore() {
        return this.cash + this.numberOfShares * parseFloat(this.testData[this.testData.length - 1][4]);
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