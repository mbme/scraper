/* eslint-env node */

import esbuild from 'esbuild';
import packageJson from './package.json';

const isProduction = process.env.NODE_ENV === 'production';

const banner = `
// ==UserScript==
// @name         ${packageJson.name}
// @version      ${packageJson.version}
// @description  ${packageJson.description}
// @author       ${packageJson.author}
// @match        *
// @grant        GM_registerMenuCommand
// @updateURL    https://raw.githubusercontent.com/mbme/scraper/main/docs/scraper.user.js
// @downloadURL  https://raw.githubusercontent.com/mbme/scraper/main/docs/scraper.user.js
// ==/UserScript==
`;

await esbuild.build({
  entryPoints: ['./src/index.ts'],
  outfile: './docs/scraper.user.js',

  banner: {
    js: banner,
  },

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
