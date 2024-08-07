import { ScrapedData, SCRAPERS } from './scrapers';
import scraperUIstr from './scraper-ui.html';

export type ScrapeResult = {
  url: string;

  scraperName?: string;

  data?: ScrapedData;
  error?: string;
};

export class BrowserScraper {
  public results: ScrapeResult[] = [];

  injectScraperUI(onDone: () => void) {
    document.body.insertAdjacentHTML('afterbegin', scraperUIstr);

    document
      .getElementById('_scraper-ui-btn-scrape')!
      .addEventListener('click', () => void this.scrape());

    document.getElementById('_scraper-ui-btn-done')!.addEventListener('click', () => {
      onDone();
    });
  }

  destroy() {
    document.getElementById('_scraper-ui-panel')?.remove();
  }

  async scrape(): Promise<ScrapeResult> {
    const result: ScrapeResult = {
      url: location.href,
    };

    for (const scraper of SCRAPERS) {
      if (!scraper.pattern.test(window.location.href)) {
        continue;
      }

      try {
        const data = await scraper.scrape();
        console.info(`scraper ${scraper.constructor.name} succeeded`);

        result.scraperName = scraper.constructor.name;
        result.data = data;

        break;
      } catch (e) {
        console.error(`scraper ${scraper.constructor.name} failed:`, e);

        result.scraperName = scraper.constructor.name;
        result.error = (e as Error).stack?.toString() ?? '';

        this._addResult(result);

        throw e;
      }
    }

    this._addResult(result);

    return result;
  }

  private _addResult(result: ScrapeResult) {
    this.results.push(result);

    const totalCountEl = document.querySelector('#_scraper-results-counter ._scraper-total-count');
    const errorsCountEl = document.querySelector(
      '#_scraper-results-counter ._scraper-errors-count',
    );

    if (totalCountEl) {
      totalCountEl.innerHTML = this.results.length.toString();
    }

    if (errorsCountEl) {
      errorsCountEl.innerHTML = this.results
        .filter((result) => Boolean(result.error))
        .length.toString();
    }
  }
}
