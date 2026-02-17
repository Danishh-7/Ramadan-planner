import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // @ts-expect-error - turbopack root is valid but missing in types
    turbopack: {
      root: '.',
    },
  },
};

export default nextConfig;
