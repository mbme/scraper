import { BrowserScraper, ScrapeResult } from './browser-scraper';

declare global {
  interface Window {
    _scraper?: BrowserScraper;
    GM_registerMenuCommand?: (menuItem: string, cb: () => void) => void;
  }
}

export type ScraperResultsContainer = {
  ['@type']: 'scrape-results-container';
  results: ScrapeResult[];
};

function initScraper() {
  const scraper = new BrowserScraper();
  window._scraper = scraper;

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  scraper.injectScraperUI(async () => {
    const container: ScraperResultsContainer = {
      '@type': 'scrape-results-container',
      results: scraper.results,
    };

    try {
      await navigator.clipboard.writeText(JSON.stringify(container));
    } catch (e) {
      console.error(e);
      alert(`Failed to copy text to clipboard: ${String(e)}`);

      throw e;
    }

    scraper.destroy();
    window._scraper = undefined;
  });
}

if (window.GM_registerMenuCommand) {
  window.GM_registerMenuCommand('Run scraper', initScraper);
} else {
  initScraper();
}
