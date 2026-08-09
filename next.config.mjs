/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    'rc-util',
    'rc-pagination',
    'rc-picker',
    '@babel/runtime',
    '@ant-design/icons-svg',
    'antd',
    'rc-motion',
    'rc-field-form',
    'rc-input',
    'rc-select',
    'rc-tree',
    'rc-table'
  ],
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };
    return config;
  },
  experimental: {
    esmExternals: 'loose'
  },
  // Increase API body size limit to handle large slider content
  api: {
    bodyParser: {
      sizeLimit: '50mb',
    },
  },
};

export default nextConfig;
