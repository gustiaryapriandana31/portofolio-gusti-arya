/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // Disable Webpack persistent caching to prevent the Node.js 23 JSON parsing bug
    config.cache = false;
    return config;
  },
};

export default nextConfig;


