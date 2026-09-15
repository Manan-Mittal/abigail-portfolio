import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // There is a stray package-lock.json in the home directory; without this
  // Turbopack walks up and tries to treat ~ as the workspace root.
  turbopack: { root: __dirname },
  transpilePackages: ["three"],
};

export default nextConfig;
