/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  async rewrites() {
    return [
      // Proxy requests to Collabora
      {
        source: '/collabora/:path*',
        destination: 'http://localhost:9980/:path*',
      },
      // WOPI API endpoints
      {
        source: '/wopi/files/:fileId/:action',
        destination: '/api/wopi/files/:fileId/:action',
      },
      {
        source: '/wopi/discovery',
        destination: '/api/wopi/discovery',
      },
    ];
  },
  // Add headers to allow iframe embedding and communication with Collabora
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp',
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
          {
            key: 'Cross-Origin-Resource-Policy',
            value: 'cross-origin',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;