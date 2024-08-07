import { Scraper } from './scraper';
import { YakabooBook } from './yakaboo-book';
import { SteamGame } from './steam-game';
import { MyAnimeListAnime } from './myanimelist-anime';
import { IMDBFilm } from './imdb-film';
import { Image } from './any-image';
export type { YakabooBook, SteamGame, MyAnimeListAnime, IMDBFilm, Image };
export type ScrapedData = YakabooBook | SteamGame | MyAnimeListAnime | IMDBFilm | Image;
export declare const SCRAPERS: Scraper<ScrapedData>[];
