import type { NextConfig } from "next";

/**
 * GitHub Pages serves a project site from a subpath
 * (/<repo>), so the build needs a basePath. It is supplied by the
 * deploy workflow rather than hardcoded, which keeps `npm run dev`
 * at the root and leaves a custom domain (served from /) a one-line
 * change — drop the env var and it builds for the root again.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  // Fully static: every route already prerenders, so there is no server.
  output: "export",
  basePath,
  assetPrefix: basePath || undefined,
  // Pages has no image optimizer.
  images: { unoptimized: true },
  // Emit /path/index.html so Pages resolves routes without a server.
  trailingSlash: true,
  // There is a stray package-lock.json in the home directory; without this
  // Turbopack walks up and tries to treat ~ as the workspace root.
  turbopack: { root: __dirname },
};

export default nextConfig;
