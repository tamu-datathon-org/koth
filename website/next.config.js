module.exports = {
    basePath: '/koth',
    env: {
        GATEKEEPER_URL: "https://tamudatathon.com/auth",
        WORKER_SPAWNER_URL: "http://worker:3000/koth/admin",
        WORKER_SPAWNER_KEY: "secretKey",
        GATEKEEPER_INTEGRATION_SECRET: "kjnBNjk23oJOMKbUVTreCyfDresdxijgy",
        DB_PROBLEMS_COLLECTION: "problems",
        DB_SUBMISSIONS_COLLECTION: "submissions"
    }
}