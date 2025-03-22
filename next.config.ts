import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.unsplash.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "**.pexels.com",
        port: "",
      },

      {
        protocol: "https",
        hostname: "unsplash.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "**.imagekit.io",
        port: "",
      },
      {
        protocol: "http",
        hostname: "**.cloudinary.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "**.cloudinary.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "**.s3.amazonaws.com",
        port: "",
      },
    ],
  },
};

export default nextConfig;
