import { ScrapedData } from './scrapers';
export type ScrapeResult = {
    url: string;
    scraperName?: string;
    data?: ScrapedData;
    error?: string;
};
export declare class BrowserScraper {
    results: ScrapeResult[];
    injectScraperUI(onDone: () => void): void;
    destroy(): void;
    scrape(): Promise<ScrapeResult>;
    private _addResult;
}
