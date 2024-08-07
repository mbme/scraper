/* eslint-env node */

import esbuild from 'esbuild';
import packageJson from './package.json';

const isProduction = process.env.NODE_ENV === 'production';

const scriptName = packageJson.name + (isProduction ? '' : '-dev');
const scriptVersion = isProduction ? packageJson.version : 'Beta';

const now = new Date();
const nowStr = `${now.toDateString()} ${now.toTimeString()}`;

const prodUrl = isProduction
  ? 'https://raw.githubusercontent.com/mbme/scraper/main/docs/scraper.user.js'
  : '';

const banner = `
// ==UserScript==
// @name         ${scriptName}
// @version      ${scriptVersion}
// @description  ${packageJson.description} Updated on ${nowStr}
// @author       ${packageJson.author}
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @updateURL    ${prodUrl}
// @downloadURL  ${prodUrl}
// ==/UserScript==
`;

await esbuild.build({
  entryPoints: ['./src/index.ts'],
  outfile: './dist/scraper.user.js',

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
