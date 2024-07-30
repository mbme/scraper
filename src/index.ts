import { BrowserScraper } from './browser-scraper';

declare global {
  interface Window {
    _scraper: BrowserScraper;
    GM_registerMenuCommand?: (menuItem: string, cb: () => void) => void;
  }
}

function initScraper() {
  window._scraper = new BrowserScraper();
  window._scraper.injectScraperUI();
}

if (window.GM_registerMenuCommand) {
  window.GM_registerMenuCommand('Run scraper', initScraper);
} else {
  initScraper();
}
