import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['static.nike.com'],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '1mb',
    },
  },
};

export default nextConfig;
