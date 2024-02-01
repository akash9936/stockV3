const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    entry: './src/nseIndiaV2.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
    },
    resolve: {
        fallback: {
            path: require.resolve('path-browserify'),
            fs: false,
            stream: require.resolve('stream-browserify'),
            zlib: require.resolve('browserify-zlib'),
            querystring: require.resolve('querystring-es3'),
            crypto: require.resolve('crypto-browserify'),
            http: require.resolve('stream-http'),
            net: false,
            async_hooks: false,
            os: require.resolve('os-browserify/browser'),
        },
    },
    devtool: 'source-map',
    plugins: [
        new CleanWebpackPlugin(),
    ],
    // ... other configurations
};
