import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow Next.js to optimize images from Cloudinary
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",   // allow all paths under this hostname
      },
      // If you use other external image hosts (e.g., user avatars), add them here
    ],
  },

  // Fix cross-origin dev warning when accessing via network IP
  allowedDevOrigins: ["10.227.226.70", "10.108.96.70"], // add your actual LAN IPs
};

export default nextConfig;