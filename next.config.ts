import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  // Allow large image files
  experimental: {},
};

export default nextConfig;
