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
