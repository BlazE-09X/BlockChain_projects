import type { NextConfig } from "next";
/** @type {import('next').NextConfig} */

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/Blockchain_projects/project7/frontend-web', 
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
