import { BrowserScraper, ScrapeResult } from './browser-scraper';
export type { ScrapedData, YakabooBook, SteamGame, MyAnimeListAnime, IMDBFilm, Image, } from './scrapers';
export type { ScrapeResult };
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
