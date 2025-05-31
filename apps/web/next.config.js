/** @type {import('next').NextConfig} */
import dotenv from "dotenv";
dotenv.config({ path: "../../.env" });
const nextConfig = {
    // env:{
    //     DATABASE_URL: process.env.DATABASE_URL,
    // }
    async headers() {
        return [
            {
                source: '/((?!auth|login|api/auth).*)',
                headers: [
                    { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
                    { key: 'Cross-Origin-Embedder-Policy', value: 'require-corp' },
                ],
            },
        ];
    },
};

export default nextConfig;
