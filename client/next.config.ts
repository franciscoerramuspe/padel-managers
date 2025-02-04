/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compress: true,
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@heroicons/react', '@phosphor-icons/react'],
  },
  images: {
    domains: ['goipmracccjxjmhpizib.supabase.co', 'your-image-domain.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'goipmracccjxjmhpizib.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

export default nextConfig;
