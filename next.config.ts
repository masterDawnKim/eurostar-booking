import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/eurostar-booking",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
