import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Packages with Cloudflare Workers (workerd) specific code
  // Read more: https://opennext.js.org/cloudflare/howtos/workerd
  serverExternalPackages: ['jose', 'pg-cloudflare'],

  // Your Next.js config here
  webpack: (webpackConfig: any, { isServer, webpack }: any) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    // Replace drizzle-kit imports with empty module (dev-only package, not needed at runtime)
    if (isServer) {
      webpackConfig.plugins = webpackConfig.plugins || []
      webpackConfig.plugins.push(
        new webpack.IgnorePlugin({
          resourceRegExp: /^drizzle-kit(\/|$)/,
        }),
      )
    }

    return webpackConfig
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
