import path from "node:path";

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    resolveAlias: {
      "@registry": path.resolve(__dirname, "./registry"),
    },
  },
};

export default nextConfig;
