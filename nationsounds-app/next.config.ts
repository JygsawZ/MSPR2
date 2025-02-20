import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  scripts: {
    lint: "next lint",
  },
  compilerOptions: {
    baseUrl: "src/",
  },
};

export default nextConfig;
