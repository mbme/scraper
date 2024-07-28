/* eslint-env node */

import esbuild from 'esbuild';

const isProduction = process.env.NODE_ENV === 'production';

await esbuild.build({
  entryPoints: ['./src/index.ts'],
  outfile: './dist/index.js',

  target: ['es2019'],
  bundle: true,
  minify: false, // ease of debugging is more important than size
  sourcemap: true,

  loader: {
    '.html': 'text',
  },

  define: {
    'process.env.NODE_ENV': isProduction ? '"production"' : '"development"',
  },
});
