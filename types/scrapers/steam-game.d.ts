import { BaseScrapeResult, Scraper } from './scraper';
export interface SteamGame extends BaseScrapeResult<'SteamGame'> {
    coverURL: string;
    name: string;
    releaseDate: string;
    developers: string;
    description: string;
}
export declare class SteamGameScraper extends Scraper<SteamGame> {
    readonly pattern: URLPattern;
    scrape(): {
        typeName: "SteamGame";
        version: number;
        coverURL: string;
        name: string;
        releaseDate: string;
        developers: string;
        description: string;
    };
}
