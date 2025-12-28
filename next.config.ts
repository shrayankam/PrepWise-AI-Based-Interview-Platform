// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
//   eslint: {
//     // Ignore ESLint errors during builds
//     ignoreDuringBuilds: true,
//   },
//   typescript: {
//     ignoreBuildErrors: true,
//   },
// };

const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
} as any;

export default nextConfig;

