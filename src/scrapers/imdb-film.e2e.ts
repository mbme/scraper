/* eslint-disable @typescript-eslint/no-floating-promises */

import { it } from 'node:test';
import { defineScraperTestSuite, testScrapingUrl } from '../test-utils';

defineScraperTestSuite('imdb', (getPage) => {
  it('can scrape a film', async (t) => {
    await testScrapingUrl(t, getPage(), 'https://www.imdb.com/title/tt0133093/', {
      waitForNetworkIdle: true,
    });
  });

  it('can scrape series', async (t) => {
    await testScrapingUrl(t, getPage(), 'https://www.imdb.com/title/tt0098936/', {
      waitForNetworkIdle: true,
    });
  });

  it('can scrape mini series', async (t) => {
    await testScrapingUrl(t, getPage(), 'https://www.imdb.com/title/tt8134186/', {
      waitForNetworkIdle: true,
    });
  });
});
