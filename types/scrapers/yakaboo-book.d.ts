import { Scraper } from './scraper';
export type YakabooBook = {
    typeName: 'YakabooBook';
    coverURL: string;
    title: string;
    authors: string;
    publicationDate: string;
    description: string;
    translators: string;
    publisher: string;
    pages: number;
    language: string;
};
export declare class YakabooBookScraper extends Scraper<'YakabooBook', YakabooBook> {
    readonly pattern: URLPattern;
    readonly scrape: () => Promise<YakabooBook>;
}
