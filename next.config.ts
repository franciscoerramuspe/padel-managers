/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
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
    unoptimized: true
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  poweredByHeader: false,
  webpack: (config, { isServer }) => {
    config.stats = 'verbose';
    return config;
  }
};

export default nextConfig;