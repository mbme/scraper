import { BaseScrapeResult, Scraper } from './scraper';
export interface YakabooBook extends BaseScrapeResult<'YakabooBook'> {
    coverURL: string;
    title: string;
    authors: string;
    publicationDate: string;
    description: string;
    translators: string;
    publisher: string;
    pages: number;
    language: string;
}
export declare class YakabooBookScraper extends Scraper<YakabooBook> {
    readonly pattern: URLPattern;
    scrape(): Promise<{
        typeName: "YakabooBook";
        version: number;
        coverURL: string;
        title: string;
        authors: string;
        publicationDate: string;
        description: string;
        translators: string;
        publisher: string;
        pages: number;
        language: string;
    }>;
}
