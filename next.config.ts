import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    turbopack: {},
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '8002',
                pathname: '/assets/**/*',
            },
        ],
    },
}

export default nextConfig;