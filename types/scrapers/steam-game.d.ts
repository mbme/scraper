import { Scraper } from './scraper';
type SteamGame = {
    typeName: 'SteamGame';
    coverURL: string;
    name: string;
    releaseDate: string;
    developers: string;
    description: string;
};
export declare class SteamGameScraper extends Scraper<'SteamGame', SteamGame> {
    readonly pattern: URLPattern;
    readonly scrape: () => SteamGame;
}
export {};
