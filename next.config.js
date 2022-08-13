/** @type {import('next').NextConfig} */

const ContentSecurityPolicy = `
  connect-src 'self' vitals.vercel-insights.com; 
`

// You can choose which headers to add to the list
// after learning more below.
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: ContentSecurityPolicy.replace(/\s{2,}/g, ' ').trim()
  }
]


const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async headers() {
    return [
      {
        // Apply these headers to all routes in your application.
        source: '/:path*',
        headers: securityHeaders,
      },
    ]
  },
};

module.exports = nextConfig;
