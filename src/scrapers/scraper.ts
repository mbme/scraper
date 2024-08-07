import 'urlpattern-polyfill';

export interface BaseScrapeResult<TypeName extends string> {
  typeName: TypeName;
}

export abstract class Scraper<R extends BaseScrapeResult<string>> {
  abstract readonly pattern: URLPattern;

  public abstract scrape(): Promise<R> | R;
}
