/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compress: true,
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@heroicons/react', '@phosphor-icons/react'],
  },
  images: {
    domains: ['goipmracccjxjmhpizib.supabase.co'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'goipmracccjxjmhpizib.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;