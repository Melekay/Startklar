import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Reiner statischer Export: kein Server, kein Backend.
  output: "export",
  images: { unoptimized: true },
  poweredByHeader: false,
};

export default nextConfig;
