const withNx = require('@nrwl/next/plugins/with-nx')

const withSWRTypes = require('next-typed-api-with-swr')
/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  /* config options here */
  experimental: { nftTracing: true, topLevelAwait: true },
  experiments: { topLevelAwait: true },
  staticPageGenerationTimeout: 120,
  webpack(config, { dev }) {
    if (dev) {
      config.devtool = 'cheap-module-source-map'
    }
    return config
  },
  images: { domains: ['avatars.githubusercontent.com'] },
}

module.exports = withNx(
  //  withSWRTypes(
  nextConfig,
  //, {
  // outputFilePath: '__generated__/swr-api-types.ts',
  //}),
)