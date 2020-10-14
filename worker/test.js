const prc = require('./dist/process.js');

prc({
    id: 9,
    data: {
        "languageUsed": "PYTHON3",
        "submissionId": "lolol",
        "downloadUrl": "https://firebasestorage.googleapis.com/v0/b/koth-c3d3c.appspot.com/o/sample-stonks.zip?alt=media&token=dbab8bf7-1d6c-4139-9967-dc5648f6d3d3",
        "problemId": "stock-prediction",
        "entrypointFile": "main.py"
    },
    log: (line) => console.log(line),
    progress: (prg) => console.log("progress:", prg)
})