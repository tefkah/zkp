const withNx = require('@nrwl/next/plugins/with-nx')

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  /* config options here */
  experimental: { nftTracing: true, topLevelAwait: true },
  experiments: { topLevelAwait: true },
  staticPageGenerationTimeout: 120,
  images: { domains: ['avatars.githubusercontent.com'] },
}

module.exports = withNx(nextConfig)
