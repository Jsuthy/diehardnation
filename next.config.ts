import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable the in-memory ISR cache (current Next key for experimental.isrMemoryCacheSize).
  // ISR pages render only when visited and persist to the filesystem — no bill for
  // pages that never get traffic.
  cacheMaxMemorySize: 0,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'i.ebayimg.com' },
      { protocol: 'https', hostname: '*.ebayimg.com' },
      { protocol: 'https', hostname: 'www.thesportsdb.com' },
      { protocol: 'https', hostname: 'r2.thesportsdb.com' },
    ],
  },
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.diehardnation.com' }],
        destination: 'https://diehardnation.com/:path*',
        permanent: true,
      },
    ]
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ]
  },
};

export default nextConfig;
