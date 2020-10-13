module.exports = {
    basePath: '/koth',
    async rewrites() {
        return [
            {
                basePath: false,
                source: '/:path*',
                destination: 'https://dev.tamudatathon.com/:path*'
            }
        ]
    },
    env: {
        GATEKEEPER_URL: "https://tamudatathon.com/auth"
    }
}