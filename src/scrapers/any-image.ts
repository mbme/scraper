import { BaseScrapeResult, Scraper } from './scraper';

export interface Image extends BaseScrapeResult<'Image'> {
  imageURL: string;
}

export class ImageScraper extends Scraper<Image> {
  readonly pattern = new URLPattern({
    pathname: '/*.:filetype(jpg|png)',
  });

  scrape() {
    return {
      typeName: 'Image' as const,
      imageURL: location.href,
    };
  }
}
