import { Scraper } from './scraper';
export type IMDBFilm = {
    typeName: 'IMDBFilm';
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
};
export declare class IMDBFilmScraper extends Scraper<'IMDBFilm', IMDBFilm> {
    readonly pattern: URLPattern;
    readonly scrape: () => Promise<IMDBFilm>;
}
