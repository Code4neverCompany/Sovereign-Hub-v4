/** @type {import('next').NextConfig} */
const nextConfig = {
  // 🏁 NEP v1.1 Standard: Dynamic Server Mode (Not static export)
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
