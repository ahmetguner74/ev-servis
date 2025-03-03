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
  // Environment değişkenlerine runtime'da erişim için
  serverRuntimeConfig: {
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  },
  publicRuntimeConfig: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL
  },
};

module.exports = nextConfig; 