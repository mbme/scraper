import { Scraper } from './scraper';
export type MyAnimeListAnime = {
    typeName: 'MyAnimeListAnime';
    title: string;
    coverURL: string;
    releaseDate: string;
    creators: string;
    duration: string;
    description: string;
};
export declare class MyAnimeListAnimeScraper extends Scraper<'MyAnimeListAnime', MyAnimeListAnime> {
    readonly pattern: URLPattern;
    readonly scrape: () => MyAnimeListAnime;
}
