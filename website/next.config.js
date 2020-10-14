module.exports = {
    basePath: '/koth',
    async rewrites() {
        return [
            {
                source: '/admin/:path*',
                destination: process.env.WORKER_SPAWNER_URL + "/:path*"
            },
            {
                basePath: false,
                source: '/:path*',
                destination: 'https://dev.tamudatathon.com/:path*'
            }
        ]
    },
    env: {
        GATEKEEPER_URL: "https://tamudatathon.com/auth",
        WORKER_SPAWNER_URL: "http://example.com/koth/admin",
        WORKER_SPAWNER_KEY: "secretKey"
    }
}