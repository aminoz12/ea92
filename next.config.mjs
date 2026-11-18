// Next builds a few client entries as "./" + path.relative(projectDir,
// "next/dist/client/…"). On Windows, when node_modules lives on another drive
// (this machine: node_modules is a junction to C: because D: is full), no
// relative path exists and Next emits an invalid "./C:/…" request
// ("Module not found: Can't resolve './C:/…/next/dist/client/app-next-dev.js'").
// Such a request is never valid, so turning it back into an absolute path is
// safe on every machine.
const CROSS_DRIVE_REQUEST = /^\.\/([A-Za-z]:\/)/
const fixCrossDriveEntry = (value) => {
  if (typeof value === 'string') return value.replace(CROSS_DRIVE_REQUEST, '$1')
  if (Array.isArray(value)) return value.map(fixCrossDriveEntry)
  if (value && typeof value === 'object' && 'import' in value) {
    return { ...value, import: fixCrossDriveEntry(value.import) }
  }
  return value
}

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
  webpack(config, { dev }) {
    // This machine has limited RAM. Webpack's persistent (filesystem) cache
    // serializes a single large buffer and can crash the dev server with
    // "RangeError: Array buffer allocation failed" during PackFileCacheStrategy.
    // Disable the persistent cache in development to keep the dev server stable
    // (production `next build` is unaffected).
    if (dev) {
      config.cache = false
    }

    if (process.platform === 'win32') {
      const originalEntry = config.entry
      config.entry = async () => {
        const entries = typeof originalEntry === 'function' ? await originalEntry() : originalEntry
        return Object.fromEntries(
          Object.entries(entries).map(([name, value]) => [name, fixCrossDriveEntry(value)]),
        )
      }
    }
    return config
  },
}

export default nextConfig
