import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  compress: true,
  images: {
    // On the VPS (no Vercel quota) use Next's built-in optimizer: every <Image> is resized to the
    // `sizes` it declares and served as WebP, then cached on disk.
    // On Vercel keep images unoptimized so we never hit its Image Optimization quota (402 errors).
    unoptimized: process.env.VERCEL === "1",
    // WebP only: AVIF encoding is much slower on a first (uncached) request.
    formats: ["image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.myshopify.com",
        pathname: "/**",
      },
    ],
  },
  async headers() {
    return [
      // Hero frames. Browsers request the folder as "video%20frame", which the plain "video frame" source
      // never matched, so frames were served with max-age=0 and re-checked on every visit.
      {
        source: "/video%20frame/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/video frame/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/models/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/video/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;

