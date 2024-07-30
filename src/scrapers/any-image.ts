import { Scraper } from './scraper';

export type Image = {
  typeName: 'Image';
  imageURL: string;
};

export class ImageScraper extends Scraper<'Image', Image> {
  readonly pattern = new URLPattern({
    pathname: '/*.:filetype(jpg|png)',
  });

  readonly scrape = (): Image => ({
    typeName: 'Image',
    imageURL: location.href,
  });
}
