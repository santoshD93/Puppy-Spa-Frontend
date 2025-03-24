import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // ✅ This allows builds to succeed even if ESLint has warnings/errors
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
