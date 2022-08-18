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
  swcMinify: true
};

module.exports = nextConfig;
