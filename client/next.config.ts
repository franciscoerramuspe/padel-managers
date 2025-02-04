/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@heroicons/react', '@phosphor-icons/react'],
  },
  images: {
    domains: ['your-image-domain.com'],
  },
};

export default nextConfig;
