/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'tr.rbxcdn.com' },
      { protocol: 'https', hostname: 'www.roblox.com' },
      { protocol: 'https', hostname: 'thumbnails.roblox.com' },
      { protocol: 'https', hostname: 'i.ytimg.com' },
    ],
  },
  experimental: {
    optimizePackageImports: [],
  },
  async redirects() {
    return [
      // Old sub-routes — content merged into the single /blox-fruits/ hub.
      { source: '/blox-fruits/latest', destination: '/blox-fruits', permanent: true },
      { source: '/blox-fruits/expired', destination: '/blox-fruits', permanent: true },
      { source: '/blox-fruits/redeem-guide', destination: '/blox-fruits', permanent: true },
      // Removed games — site is now Blox-Fruits-only. Send any legacy URL to home.
      { source: '/anime-adventures', destination: '/', permanent: true },
      { source: '/anime-adventures/:path*', destination: '/', permanent: true },
      { source: '/anime-vanguards', destination: '/', permanent: true },
      { source: '/anime-vanguards/:path*', destination: '/', permanent: true },
      { source: '/genshin-impact', destination: '/', permanent: true },
      { source: '/genshin-impact/:path*', destination: '/', permanent: true },
      { source: '/honkai-star-rail', destination: '/', permanent: true },
      { source: '/honkai-star-rail/:path*', destination: '/', permanent: true },
      { source: '/king-legacy', destination: '/', permanent: true },
      { source: '/king-legacy/:path*', destination: '/', permanent: true },
      { source: '/pet-simulator-99', destination: '/', permanent: true },
      { source: '/pet-simulator-99/:path*', destination: '/', permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        ],
      },
    ];
  },
};

export default nextConfig;
