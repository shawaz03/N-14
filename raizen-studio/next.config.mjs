/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors 'self' https://shawaz.vercel.app http://localhost:3000 https://*.vercel.app",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
