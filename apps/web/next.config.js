/** @type {import('next').NextConfig} */
import dotenv from "dotenv";
dotenv.config({ path: "../../.env" });
const nextConfig = {
    // env:{
    //     DATABASE_URL: process.env.DATABASE_URL,
    // }
};

export default nextConfig;
