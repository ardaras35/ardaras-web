import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  assetPrefix: "/",   // tüm assetler relative olsun
  trailingSlash: true,
};

export default nextConfig;
