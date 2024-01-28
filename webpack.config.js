const path = require('path'); 
module.exports = {
    entry: './src/nseIndiaV2.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'bundle.js',
    },
    resolve: {
        fallback: {
          path: require.resolve('path-browserify'),
          fs: false, // You may not need a polyfill for fs in a browser environment
          stream: require.resolve('stream-browserify'),
          zlib: require.resolve('browserify-zlib'),
          querystring: require.resolve('querystring-es3'),
          crypto: require.resolve('crypto-browserify'),
          http: require.resolve('stream-http'),
          net: false, // You may not need a polyfill for net in a browser environment
          async_hooks: false, // You may not need a polyfill for async_hooks in a browser environment
        },
      },
    // ... other configurations
  };
  