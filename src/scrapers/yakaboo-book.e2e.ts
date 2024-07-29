/* eslint-disable @typescript-eslint/no-floating-promises */

import { it } from 'node:test';
import { defineScraperTestSuite, testScrapingUrl } from '../test-utils';

defineScraperTestSuite('yakaboo', (getPage) => {
  it('can scrape a book', async (t) => {
    await testScrapingUrl(
      t,
      getPage(),
      'https://www.yakaboo.ua/ua/stories-of-your-life-and-others.html',
      { waitForNetworkIdle: true },
    );
  });
});
