import { BrowserScraper } from './browser-scraper';

declare global {
  interface Window {
    _scraper: BrowserScraper;
  }
}

window._scraper = new BrowserScraper();
window._scraper.injectScraperUI();
