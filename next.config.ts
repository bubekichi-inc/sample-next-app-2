import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowLocalIP: process.env.NODE_ENV === "development",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.jp',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.microcms-assets.io',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'wdupexpbaoogtptmeaca.supabase.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
