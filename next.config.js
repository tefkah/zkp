/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  /* config options here */
  experimental: { nftTracing: true },
  staticPageGenerationTimeout: 120,
}

module.exports = nextConfig
