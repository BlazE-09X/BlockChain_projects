import type { NextConfig } from "next";

const repo = "/Blockchain_projects/project7/ballot-next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: repo,
  assetPrefix: repo + "/",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;