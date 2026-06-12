import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Next.js 16 file tracing omits Prisma engines — required on Netlify serverless.
  outputFileTracingIncludes: {
    "/*": ["./node_modules/.prisma/client/**/*"],
  },
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
