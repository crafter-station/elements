import path from "node:path";

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  turbopack: {
    resolveAlias: {
      "@registry": path.resolve(__dirname, "./registry"),
    },
  },
  async headers() {
    return [
      {
        // Raw SVGs are a public asset API: allow cross-origin reads and cache
        // them hard, since a given logo file only changes on a registry build.
        source: "/r/svg/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          {
            key: "Cache-Control",
            value:
              "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
