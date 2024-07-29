/* eslint-disable @typescript-eslint/no-floating-promises */

import { after, afterEach, beforeEach, describe, TestContext } from 'node:test';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer, { Browser, BrowserContext, Page, PuppeteerLifeCycleEvent } from 'puppeteer-core';

const DEBUG = process.env.DEBUG === 'true';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const scraperScript = await fs.readFile(path.join(__dirname, '../dist/index.js'), 'utf-8');

let browser: Browser | undefined;
let context: BrowserContext | undefined;

async function openBrowserIfNeeded() {
  if (!browser) {
    browser = await puppeteer.launch({
      headless: !DEBUG,
      executablePath: process.env.CHROMIUM_PATH,
      slowMo: DEBUG ? 250 : undefined,
      devtools: DEBUG,
      defaultViewport: {
        width: 1280,
        height: 1024,
      },
      args: ['--incognito'],
    });
  }

  if (!context) {
    // create new anonymous browser context
    context = await browser.createBrowserContext();
  }
}

export function defineScraperTestSuite(suiteName: string, cb: (getPage: () => Page) => void) {
  describe(suiteName, () => {
    let page: Page;

    beforeEach(async () => {
      await openBrowserIfNeeded();
      page = await context!.newPage();
    });

    afterEach(async () => {
      await page.close();
    });

    after(async () => {
      await context?.close();
      await browser?.close();
      context = undefined;
      browser = undefined;
    });

    cb(() => page);
  });
}

type PageSetupOptions = {
  waitForNetworkIdle?: boolean;
};
export async function setupPage(page: Page, url: string, options: PageSetupOptions = {}) {
  await page.setUserAgent(
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
  );

  const waitUntil: PuppeteerLifeCycleEvent[] = ['domcontentloaded'];
  if (options.waitForNetworkIdle) {
    waitUntil.push('networkidle2');
  }
  await page.goto(url, { waitUntil });

  await page.evaluate(scraperScript);
}

export async function scrapePage(t: TestContext, page: Page) {
  try {
    const result = await page.evaluate(() => {
      return window._scraper.scrape();
    });

    return result;
  } catch (e) {
    const now = new Date().toISOString();
    await page.screenshot({
      path: path.resolve(__dirname, `../screenshots/${now}-${t.fullName}.png`),
      // fullPage: true,
    });

    throw e;
  }
}

export const testScrapingUrl = async (
  t: TestContext,
  page: Page,
  url: string,
  options?: PageSetupOptions,
) => {
  await setupPage(page, url, options);

  const result = await scrapePage(t, page);

  t.assert.snapshot(result);
};
