import { BaseScrapeResult, Scraper } from './scraper';
export interface Image extends BaseScrapeResult<'Image'> {
    imageURL: string;
}
export declare class ImageScraper extends Scraper<Image> {
    readonly pattern: URLPattern;
    scrape(): {
        typeName: "Image";
        version: number;
        imageURL: string;
    };
}
