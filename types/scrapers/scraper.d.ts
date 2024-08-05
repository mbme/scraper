import 'urlpattern-polyfill';
export declare abstract class Scraper<TypeName extends string, Data extends {
    typeName: TypeName;
}> {
    abstract readonly pattern: URLPattern;
    abstract readonly scrape: (() => Data) | (() => Promise<Data>);
}
