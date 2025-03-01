/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Deployment sırasında ESLint kontrollerini devre dışı bırak
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Deployment sırasında TypeScript kontrollerini devre dışı bırak
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig; 