import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @ts-ignore
  turbopack: {
    root: process.cwd(),
  },
  experimental: {
    allowedDevOrigins: ["localhost:3000", "172.16.2.55:3000"],
  },
};

export default nextConfig;
