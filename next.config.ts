import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The build script runs TypeScript 7 before Next.js. Next still needs the
  // older TypeScript compiler API for configuration and editor tooling.
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "fe-cdn.dokie.ai",
      },
      {
        protocol: "https",
        hostname: "ppt-cdn.dokie.ai",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "ai-ppt-1311181695.cos.na-siliconvalley.myqcloud.com",
      },
    ],
  },
};

export default nextConfig;
