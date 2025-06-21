import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Remove standalone output for development
  // output: 'standalone', // Only use this for Docker production builds
  eslint: {
    // Disable the no-img-element rule during builds
    ignoreDuringBuilds: false,
    dirs: ['pages', 'app', 'components', 'lib', 'src'],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '1337',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'api.coffeelogik.com',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
