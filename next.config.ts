import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cms-assets.unrealengine.com",
      },
    ],
  },
};

export default nextConfig;
