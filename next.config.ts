import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "viciad.org",
          },
        ],
        destination: "https://www.viciad.org/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
