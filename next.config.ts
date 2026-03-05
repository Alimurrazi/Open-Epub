import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  webpack(config: any) {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      crypto: false,
      stream: false,
      zlib: false,
      http: false,
      https: false,
      net: false,
      tls: false,
      child_process: false,
    };
    return config;
  },
};

export default nextConfig;
