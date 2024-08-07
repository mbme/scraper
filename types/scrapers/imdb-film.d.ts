import { BaseScrapeResult, Scraper } from './scraper';
export interface IMDBFilm extends BaseScrapeResult<'IMDBFilm'> {
    title: string;
    coverURL: string;
    releaseDate: string;
    originalLanguage: string;
    countriesOfOrigin: string;
    creators: string;
    cast: string;
    seasons?: number;
    episodes?: number;
    duration: string;
    description: string;
}
export declare class IMDBFilmScraper extends Scraper<IMDBFilm> {
    readonly pattern: URLPattern;
    scrape(): Promise<{
        typeName: "IMDBFilm";
        version: number;
        title: string;
        coverURL: string;
        releaseDate: string;
        originalLanguage: string;
        countriesOfOrigin: string;
        creators: string;
        cast: string;
        seasons: number | undefined;
        episodes: number | undefined;
        duration: string;
        description: string;
    }>;
}
