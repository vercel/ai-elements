import type { NextConfig } from 'next';

const config: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@repo/elements', '@repo/shadcn-ui'],
  experimental: {
    optimizePackageImports: ['@repo/elements', 'lucide-react'],
  },
};

export default config;
