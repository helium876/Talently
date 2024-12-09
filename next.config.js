/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
    workerThreads: false,
    cpus: 1,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  output: 'standalone',
  poweredByHeader: false,
  reactStrictMode: true,
  swcMinify: true,
  distDir: '.next',
  cleanDistDir: true,
  generateEtags: false,
  compress: true,
  images: {
    domains: ['localhost', 'talently-iota.vercel.app'],
    unoptimized: true,
  },
}

module.exports = nextConfig 