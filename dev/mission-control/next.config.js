/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Enable WebSocket support for OpenClaw Neural Link
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      ws: false,
    };
    return config;
  },
}

module.exports = nextConfig
