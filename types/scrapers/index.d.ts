import { ArrayElement } from '../utils';
import { ExtractScraperGeneric } from './scraper';
import { YakabooBookScraper } from './yakaboo-book';
import { SteamGameScraper } from './steam-game';
import { MyAnimeListAnimeScraper } from './myanimelist-anime';
import { IMDBFilmScraper } from './imdb-film';
import { ImageScraper } from './any-image';
export declare const SCRAPERS: readonly [YakabooBookScraper, SteamGameScraper, MyAnimeListAnimeScraper, IMDBFilmScraper, ImageScraper];
export type ScrapedData = ExtractScraperGeneric<ArrayElement<typeof SCRAPERS>>;
