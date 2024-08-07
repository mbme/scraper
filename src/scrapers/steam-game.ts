import { getEl, getListStr } from '../utils';
import { BaseScrapeResult, Scraper } from './scraper';

export interface SteamGame extends BaseScrapeResult<'SteamGame'> {
  coverURL: string;
  name: string;
  releaseDate: string;
  developers: string;
  description: string;
}

export class SteamGameScraper extends Scraper<SteamGame> {
  // https://store.steampowered.com/app/814380/Sekiro_Shadows_Die_Twice__GOTY_Edition/
  readonly pattern = new URLPattern({
    hostname: 'store.steampowered.com',
    pathname: '/app/*',
  });

  scrape() {
    const coverURL = getEl<HTMLImageElement>('.game_header_image_full', 'cover image').src;
    const name = getEl('#appHubAppName', 'game name').innerText;
    const releaseDate = getEl('.release_date .date', 'release date').innerText;
    const developers = getListStr(document, '#developers_list a');

    // remove "About this game"
    getEl('#game_area_description h2', 'description header').remove();

    const description = getEl('#game_area_description', 'description').innerText;

    return {
      typeName: 'SteamGame' as const,
      coverURL,
      name,
      releaseDate,
      developers,
      description,
    };
  }
}
