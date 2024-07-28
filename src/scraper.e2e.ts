/* eslint-disable @typescript-eslint/no-floating-promises */

import { after, afterEach, before, beforeEach, describe, it } from 'node:test';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer, { Browser, Page } from 'puppeteer-core';

const DEBUG = process.env.DEBUG === 'true';

let scraperScript: string;
let browser: Browser | undefined;
before(async () => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  scraperScript = await fs.readFile(path.join(__dirname, '../dist/index.js'), 'utf-8');
  browser = await puppeteer.launch({
    headless: !DEBUG,
    executablePath: process.env.CHROMIUM_PATH,
    slowMo: DEBUG ? 250 : undefined,
    devtools: DEBUG,
    defaultViewport: {
      width: 1280,
      height: 1024,
    },
  });
});

after(async () => {
  await browser?.close();
});

describe('scraper', () => {
  let page: Page;

  beforeEach(async () => {
    page = await browser!.newPage();
  });

  afterEach(async () => {
    await page.close();
  });

  it('works on any website', async (t) => {
    await page.goto('https://google.com/');
    await page.evaluate(scraperScript);

    await page.locator('#_scraper-ui-panel').wait();
    const result = await page.evaluate(() => {
      return window._scraper.scrape();
    });

    t.assert.snapshot(result);
  });
});
