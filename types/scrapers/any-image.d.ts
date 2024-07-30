import { Scraper } from './scraper';
export type Image = {
    typeName: 'Image';
    imageURL: string;
};
export declare class ImageScraper extends Scraper<'Image', Image> {
    readonly pattern: URLPattern;
    readonly scrape: () => Image;
}
