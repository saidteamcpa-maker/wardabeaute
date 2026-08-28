/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    loader: "custom",
    loaderFile: "./image-loader.js",
    // Remote (store-content override) images are passed through unchanged by the loader.
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
  async headers() {
    return [
      {
        // Pre-generated static image variants are content-hashed by width in the
        // filename, so they are safe to cache forever. Improves repeat-visit LCP.
        source: "/optimized/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
