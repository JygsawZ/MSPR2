/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: true,
  },
  images: {
    domains: [
      'res.cloudinary.com',
      'wsyoqfgpvjkbpuequplv.supabase.co'
    ],
  },
};

export default nextConfig; 