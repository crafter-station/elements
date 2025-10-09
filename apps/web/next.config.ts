import path from "node:path";

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  turbopack: {
    resolveAlias: {
      "@registry": path.resolve(__dirname, "./registry"),
    },
    rules: {
      "*.mdx": {
        loaders: ["fumadocs-mdx/loader"],
        as: "*.js",
      },
    },
  },
};

export default nextConfig;
