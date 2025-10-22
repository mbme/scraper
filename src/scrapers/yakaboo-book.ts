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
    const rawTitle = getEl('.base-product__title h1', 'title').innerText.trim();
    const title = rawTitle.replace(/^Книга[\s\u00A0]*/i, '').trim();

    // expand description if button is present
    getEl('.description__btn')?.click();

    const description = getEl('.description__content', 'description').innerText;

    const toggleSelectors = [
      '.main__chars button.ui-btn-nav',
      '.main__chars [data-testid="char-toggler"]',
      '[data-testid="char-toggler"] button',
      '[data-testid="char-toggler"]',
    ];
    const toggleSelectorsQuery = toggleSelectors.join(', ');

    const expandAttrsBtn = toggleSelectors
      .map((selector) => document.querySelector<HTMLElement>(selector))
      .find((btn): btn is HTMLElement => Boolean(btn));

    const isExpanded = (button: HTMLElement) => {
      const normalizedText = button.innerText.toLowerCase();
      if (normalizedText.includes('приховати') || normalizedText.includes('згорнути')) {
        return true;
      }
      if (button.getAttribute('aria-expanded') === 'true') {
        return true;
      }
      if (button.getAttribute('aria-pressed') === 'true') {
        return true;
      }
      return button.classList.contains('is-active') || button.classList.contains('active');
    };

    if (expandAttrsBtn) {
      expandAttrsBtn.scrollIntoView();
      if (!isExpanded(expandAttrsBtn)) {
        expandAttrsBtn.click();
        await waitForFunction(() => {
          const button = document.querySelector<HTMLElement>(toggleSelectorsQuery);
          if (!button) {
            return false;
          }
          return isExpanded(button);
        }, 'collapse attributes button').catch(() => undefined);
      }
    }

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
