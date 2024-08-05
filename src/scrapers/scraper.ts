import 'urlpattern-polyfill';

export abstract class Scraper<TypeName extends string, Data extends { typeName: TypeName }> {
  abstract readonly pattern: URLPattern;

  abstract readonly scrape: (() => Data) | (() => Promise<Data>);
}
