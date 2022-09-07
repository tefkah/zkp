const withNx = require('@nrwl/next/plugins/with-nx')

// const withBundleAnalyzer = require('@next/bundle-analyzer')({
//   enabled: process.env.ANALYZE === 'true',
// })

const withPlugins = require('next-compose-plugins')
/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  /* config options here */
  swcMinify: true,
  experimental: { nftTracing: true, topLevelAwait: true },
  staticPageGenerationTimeout: 180,
  images: { domains: ['avatars.githubusercontent.com'] },
}

module.exports = nextConfig
