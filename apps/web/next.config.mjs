/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@focus-guide/shared'],
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
