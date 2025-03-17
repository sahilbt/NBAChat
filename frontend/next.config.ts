import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

// disable react strict mode to prevent double rendering that tries to close socket before it's initialized
// module.exports = {
//   reactStrictMode: false,
// };

export default nextConfig;
