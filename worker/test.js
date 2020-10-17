const prc = require('./dist/process.js');

prc({
    id: 9,
    data: {
        "languageUsed": "PYTHON3",
        "submissionId": "629b7016-2e05-425b-93eb-3aff59d145e6",
        "downloadUrl": "https://koth-submissions.s3.amazonaws.com/629b7016-2e05-425b-93eb-3aff59d145e6?AWSAccessKeyId=AKIAZEU2JOVOIUGXEQTR&Expires=1602915910&Signature=1UowTAs1i8KyFyYSLLvZD8JQrxs%3D",
        "problemId": "stock-prediction",
        "entrypointFile": "main.py"
    },
    log: (line) => console.log(line),
    progress: (prg) => console.log("progress:", prg)
})