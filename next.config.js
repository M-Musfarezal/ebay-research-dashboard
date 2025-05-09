/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    turbo: {
      enabled: true,
    },
  },
};

module.exports = nextConfig;