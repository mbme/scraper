import { Scraper } from './scraper';

import { YakabooBookScraper, YakabooBook } from './yakaboo-book';
import { SteamGameScraper, SteamGame } from './steam-game';
import { MyAnimeListAnimeScraper, MyAnimeListAnime } from './myanimelist-anime';
import { IMDBFilmScraper, IMDBFilm } from './imdb-film';
import { ImageScraper, Image } from './any-image';

export type { YakabooBook, SteamGame, MyAnimeListAnime, IMDBFilm, Image };
export type ScrapedData = YakabooBook | SteamGame | MyAnimeListAnime | IMDBFilm | Image;

export const SCRAPERS: Scraper<ScrapedData['typeName'], ScrapedData>[] = [
  new YakabooBookScraper(),
  new SteamGameScraper(),
  new MyAnimeListAnimeScraper(),
  new IMDBFilmScraper(),
  new ImageScraper(),
];
