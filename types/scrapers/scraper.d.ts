import 'urlpattern-polyfill';
export interface BaseScrapeResult<TypeName extends string> {
    typeName: TypeName;
    version: number;
}
export declare abstract class Scraper<R extends BaseScrapeResult<string>> {
    abstract readonly pattern: URLPattern;
    abstract scrape(): Promise<R> | R;
}
