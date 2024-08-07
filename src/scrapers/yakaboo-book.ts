import { getEl, getTable, Obj, waitForFunction } from '../utils';
import { BaseScrapeResult, Scraper } from './scraper';

const LANGUAGE_TRANSLATIONS: Obj<string> = {
  'Українська': 'Ukrainian',
  'Англійська': 'English',
  'Російська': 'Russian',
};

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

export class YakabooBookScraper extends Scraper<YakabooBook> {
  // https://yakaboo.ua/ua/stories-of-your-life-and-others.html
  readonly pattern = new URLPattern({
    hostname: 'www.yakaboo.ua',
    pathname: '/ua/*',
  });

  async scrape() {
    const coverURL = getEl<HTMLImageElement>('.gallery img', 'cover image').src;
    const title = getEl('.base-product__title h1', 'title')
      .innerText.substring('Книга '.length) // remove the prefix that Yakaboo adds to all titles
      .trim();

    // expand description if button is present
    getEl('.description__btn')?.click();

    const description = getEl('.description__content', 'description').innerText;

    const expandAttrsBtn = getEl('.main__chars button.ui-btn-nav', 'expand attributes button');
    expandAttrsBtn.scrollIntoView();
    expandAttrsBtn.click();
    await waitForFunction(
      () =>
        document
          .querySelector<HTMLElement>('.main__chars button.ui-btn-nav')
          ?.innerText.includes('Приховати') ?? false,
      'collapse attributes button',
    );

    const table = getTable(document, '.product-chars .chars .char', '\n');

    const authors = table['Автор'] || '';

    const language = LANGUAGE_TRANSLATIONS[table['Мова'] || ''] ?? '';

    const publicationDate = table['Рік видання'] || '';
    const translators = table['Перекладач'] || '';
    const publisher = table['Видавництво'] || '';
    const pages = Number.parseInt(table['Кількість сторінок'] || '', 10);

    return {
      typeName: 'YakabooBook' as const,
      version: 1,
      coverURL,
      title,
      authors,
      publicationDate,
      description,
      translators,
      publisher,
      pages,
      language,
    };
  }
}
