/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: [],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'oaidalleapiprodscus.blob.core.windows.net',
        pathname: '/**',
      },
    ],
  },
  // Proxy all /api/* calls to the FastAPI Python backend
  async rewrites() {
    return {
      // afterFiles: checked after filesystem routes, so app/api/* route handlers
      // take priority and only unmatched paths fall through to FastAPI
      afterFiles: [
        {
          source: '/api/:path*',
          destination: `${process.env.BACKEND_URL || 'http://localhost:8000'}/api/:path*`,
        },
      ],
    }
  },
}

module.exports = nextConfig
