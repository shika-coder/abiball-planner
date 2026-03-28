import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingRoot: __dirname,
  devIndicators: false,
  experimental: {
    devtoolSegmentExplorer: false
  },
  images: {
    unoptimized: true
  }
};

export default nextConfig;
