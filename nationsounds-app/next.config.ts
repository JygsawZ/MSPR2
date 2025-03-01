import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  scripts: {
    lint: "next lint",
  },
  compilerOptions: {
    baseUrl: "src/",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "wsyoqfgpvjkbpuequplv.supabase.co",
      },
    ],
  },
};

export default nextConfig;
