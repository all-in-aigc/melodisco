import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  async redirects() {
    return [
      {
        source: "/en-US/:path*",
        destination: "/en/:path*",
        permanent: true,
      },
      {
        source: "/zh-CN/:path*",
        destination: "/zh/:path*",
        permanent: true,
      },
      {
        source: "/zh-HK/:path*",
        destination: "/zh/:path*",
        permanent: true,
      },
      {
        source: "/zh-TW/:path*",
        destination: "/zh/:path*",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "cdn1.suno.ai",
      },
      {
        protocol: "https",
        hostname: "imagedelivery.net",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
