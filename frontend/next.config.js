/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    async rewrites() {
        if(process.env.NODE_ENV === 'development')
            return [
            {
                source: '/api/:path*',
                destination: 'http://localhost:3001/api/:path*'
            },
        ]
    },
}

module.exports = nextConfig