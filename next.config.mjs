/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'drive.google.com',
      },
      {
        protocol: 'https',
        hostname: 'source.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'api.duniagames.co.id',
      },
      {
        protocol: 'https',
        hostname: 'cdn.digitalalliance.co.id',
      },
      {
        protocol: 'https',
        hostname: 'www.codashop.com',
      },
    ],
  },
  turbopack: {
    root: '.',
  },
}

export default nextConfig
