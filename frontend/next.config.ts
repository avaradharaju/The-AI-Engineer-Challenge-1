import type { NextConfig } from "next";

/**
 * In local dev, proxy /api/* to the FastAPI backend on port 8000.
 * On Vercel, vercel.json routes /api/* to the Python serverless function.
 */
const nextConfig: NextConfig = {
  async rewrites() {
    const backendUrl = process.env.BACKEND_URL ?? "http://localhost:8000";

    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
