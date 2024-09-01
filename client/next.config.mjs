/** @type {import('next').NextConfig} */

const APP_ENV = process.env.NEXT_PUBLIC_APP_ENV || "development";

const domain =
  APP_ENV === "development"
    ? "http://localhost:8000/"
    : "https://intelli-docs-backend.vercel.app/";
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${domain}:path*`,
      },
    ];
  },
};

export default nextConfig;
