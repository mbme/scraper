import { ArrayElement } from '../utils';
import { ExtractScraperGeneric } from './scraper';

import { YakabooBookScraper } from './yakaboo-book';
import { SteamGameScraper } from './steam-game';
import { MyAnimeListAnimeScraper } from './myanimelist-anime';
import { IMDBFilmScraper } from './imdb-film';
import { ImageScraper } from './any-image';

export const SCRAPERS = [
  new YakabooBookScraper(),
  new SteamGameScraper(),
  new MyAnimeListAnimeScraper(),
  new IMDBFilmScraper(),
  new ImageScraper(),
] as const;

export type ScrapedData = ExtractScraperGeneric<ArrayElement<typeof SCRAPERS>>;
