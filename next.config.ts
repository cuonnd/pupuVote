import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // Tắt cảnh báo lint khi build
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Bỏ qua kiểm tra type khi build
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
