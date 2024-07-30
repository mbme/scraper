import { ArrayElement } from '../utils';
import { ExtractScraperGeneric } from './scraper';

import { YakabooBookScraper, YakabooBook } from './yakaboo-book';
import { SteamGameScraper, SteamGame } from './steam-game';
import { MyAnimeListAnimeScraper, MyAnimeListAnime } from './myanimelist-anime';
import { IMDBFilmScraper, IMDBFilm } from './imdb-film';
import { ImageScraper, Image } from './any-image';

export const SCRAPERS = [
  new YakabooBookScraper(),
  new SteamGameScraper(),
  new MyAnimeListAnimeScraper(),
  new IMDBFilmScraper(),
  new ImageScraper(),
] as const;

export type ScrapedData = ExtractScraperGeneric<ArrayElement<typeof SCRAPERS>>;

export type { YakabooBook, SteamGame, MyAnimeListAnime, IMDBFilm, Image };
