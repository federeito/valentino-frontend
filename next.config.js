/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
    qualities: [70, 75, 85, 95],
  },
  async rewrites() {
    return [
      {
        source: '/accesorios-para-el-pelo',
        destination: '/products',
      },
      {
        source: '/accesorios-para-el-pelo/:path*',
        destination: '/products/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
