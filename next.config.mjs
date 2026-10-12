/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Security headers (migrated from the old vercel.json)
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ]
  },
  // This machine has limited RAM. Webpack's persistent (filesystem) cache
  // serializes a single large buffer and can crash the dev server with
  // "RangeError: Array buffer allocation failed" during PackFileCacheStrategy.
  // Disable the persistent cache in development to keep the dev server stable
  // (production `next build` is unaffected).
  webpack(config, { dev }) {
    if (dev) {
      config.cache = false
    }
    return config
  },
}

export default nextConfig
