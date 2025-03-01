/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Deployment sırasında ESLint kontrollerini devre dışı bırak
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig; 