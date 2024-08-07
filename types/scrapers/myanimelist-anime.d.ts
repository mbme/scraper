import { BaseScrapeResult, Scraper } from './scraper';
export interface MyAnimeListAnime extends BaseScrapeResult<'MyAnimeListAnime'> {
    title: string;
    coverURL: string;
    releaseDate: string;
    creators: string;
    duration: string;
    description: string;
}
export declare class MyAnimeListAnimeScraper extends Scraper<MyAnimeListAnime> {
    readonly pattern: URLPattern;
    scrape(): {
        typeName: "MyAnimeListAnime";
        version: number;
        title: string;
        coverURL: string;
        releaseDate: string;
        creators: string;
        duration: string;
        description: string;
    };
}
