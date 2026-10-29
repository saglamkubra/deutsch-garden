import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  devIndicators: false,
  output: "standalone",
  // Bound build workers so static generation also fits memory-limited hosts.
  experimental: { cpus: 2, staticGenerationMaxConcurrency: 2 },
  outputFileTracingExcludes: {
    "/*": [
      "./.cache/**/*",
      "./.env*",
      "./**/*.sqlite",
      "./**/*.sqlite-*",
      "./**/*.db",
      "./**/*.db-*",
    ],
  },
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), geolocation=(), microphone=(self)",
          },
        ],
      },
      {
        source: "/api/:path*",
        headers: [{ key: "Cache-Control", value: "private, no-store" }],
      },
      {
        source: "/sw.js",
        headers: [
          {
            key: "Cache-Control",
            value: "no-cache, no-store, must-revalidate",
          },
          { key: "Service-Worker-Allowed", value: "/" },
        ],
      },
    ];
  },
};
export default nextConfig;
