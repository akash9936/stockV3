// build-lambda.js
require('esbuild').build({
    entryPoints: ['./lambdaHandler.js'],
    bundle: true,
    platform: 'node',
    target: 'node20',
    outfile: 'dist/index.js',
    external: ['aws-sdk'], // Lambda provides this
  }).then(() => console.log('⚙️ Build complete.'));
  