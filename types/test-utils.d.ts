import { TestContext } from 'node:test';
import { Page } from 'puppeteer-core';
export declare const scraperScript: string;
export declare function defineScraperTestSuite(suiteName: string, cb: (getPage: () => Page) => void): void;
type PageSetupOptions = {
    waitForNetworkIdle?: boolean;
};
export declare function setupPage(page: Page, url: string, options?: PageSetupOptions): Promise<void>;
export declare function scrapePage(t: TestContext, page: Page): Promise<import("./browser-scraper").ScrapeResult>;
export declare const testScrapingUrl: (t: TestContext, page: Page, url: string, options?: PageSetupOptions) => Promise<void>;
export {};
