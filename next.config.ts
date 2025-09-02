import path from "node:path";

import type { NextConfig } from "next";

import { createMDX } from "fumadocs-mdx/next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  turbopack: {
    resolveAlias: {
      "@registry": path.resolve(__dirname, "./registry"),
    },
  },
};

const withMDX = createMDX();

export default withMDX(nextConfig);
