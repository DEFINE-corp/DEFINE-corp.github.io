// next.config.js
module.exports = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*', // API 경로는 그대로
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/professionals/detail',
        destination: '/professionals',
        permanent: true,
      },
    ];
  },
};