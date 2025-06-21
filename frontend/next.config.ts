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
        hostname: 'y0o4w84ckoockck8o0ss8s48.tealogik.com',
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
